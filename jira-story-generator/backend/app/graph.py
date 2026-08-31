import json
from langgraph.types import interrupt
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.graph import StateGraph, START, END
from typing import TypedDict
from app.schemas import Requirements, StoryGenerationResult,InputValidation
from app.prompts import requirements_prompt, jira_story_prompt,input_validation_prompt
from app.model import requirements_model, story_model

# Shared state used by all Langgraph nodes
class JiraStoryState(TypedDict, total=False):
    feature_idea: str
    requirements: Requirements
    clarification_question: str
    user_response: str
    story_result: StoryGenerationResult
    validation_result: bool
    validation_result: str

#LLM #0 Validation guardrail
validation_structured_model=(
    requirements_model.with_structured_output(InputValidation)
)
validation_chain=(
    input_validation_prompt | validation_structured_model
)
# LLM#1 STRUCTURED MODEL
requirements_structured_model = (requirements_model.with_structured_output(Requirements))
requirements_chain = (requirements_prompt | requirements_structured_model)

#LLM #2
story_structured_model = (story_model.with_structured_output(StoryGenerationResult))
story_generation_chain = (jira_story_prompt | story_structured_model)

# Node 0: Validate whether the input is relevant
def validate_input(state: JiraStoryState):
    print("\n[Node] Validate Input")
    validation = validation_chain.invoke({
        "feature_idea": state["feature_idea"]
    })
    print("VALID:",validation.is_valid)
    print("Reason:",validation.reason)
    return{
        "validation_result":validation.is_valid,
        "validation_reason":validation.reason
    }

# Node 1: Analyze the user's feature requirements
def analyze_requirements(state: JiraStoryState):

    print("\n[Node] Analyze Requirements")

    requirements = requirements_chain.invoke({
        "feature_idea": state["feature_idea"]
    })
    print("BEFORE CORRECTION:", requirements.is_large_feature)
    print("IMPLEMENTATION AREAS:", requirements.implementation_areas)
    if requirements.missing_information:
        requirements.is_complete=False
        if not requirements.clarification_question:
            requirements.clarification_question=(
                requirements.missing_information[0]
            )
    if len(requirements.implementation_areas)>=2:
        requirements.is_large_feature=True
    elif len(requirements.implementation_areas)<=1:
        requirements.is_large_feature=False

        
    print("\nRequirements:")
    print(requirements)
    return{
        "requirements":requirements
    }
# Node 2: Ask Clarification
def ask_clarification(state: JiraStoryState):
    print("\n[Node] Clarification Required")
    question = state["requirements"].clarification_question
    print("\nQuestion:",question)
    user_response = interrupt(question)
    return{
        "clarification_question":question,
        "user_response":user_response
    }

# Node 3: Incorporate user response
def incorporate_user_response(state: JiraStoryState):
    print("\n[Node] Incorporate user Response")
    updated_feature =(
        state["feature_idea"]
        + "\n\n User Clarification:\n"
        + state["user_response"]
    )
    return{
        "feature_idea":updated_feature
    }

# Node 4: Generate the jira story
def generate_story(state:JiraStoryState):
    print("\n[Node] Generate Jira Story")
    requirements=state["requirements"].model_dump()
    if state.get("user_response"):
        requirements["clarification_response"] = (
            state["user_response"]
        )
    story_result=story_generation_chain.invoke(
        {
            "requirements": requirements
        }
    )
    print("\nGenerated story:")
    print(story_result)
        
    return{
        "requirements": state["requirements"],
        "story_result":story_result
    }

def route_after_validation(state: JiraStoryState):
    if state["validation_result"]:
        return "valid"
    return "invalid"
# Routing-Decide what happens after completeness check
def route_after_requirements(state: JiraStoryState):
    #First check whether clarification is required
    if not state["requirements"].is_complete:
        return "clarification"
    # Requirement is complete, now check feature size
    if state["requirements"].is_large_feature:
        return "large_feature"
    return "small_feature"

def reject_invalid_input(state: JiraStoryState):
    print("\n[Node] Invalid Input")
    return{
        "validation_result": False
    }

# Create the Langgraph workflow
workflow = StateGraph(JiraStoryState)

# Register nodes
workflow.add_node(
    "validate_input",
    validate_input
)
workflow.add_node(
    "reject_invalid_input",
    reject_invalid_input
)
workflow.add_node(
    "analyze_requirements",
    analyze_requirements
)

workflow.add_node(
    "clarification",
    ask_clarification
)
workflow.add_node(
    "incorporate_user_response",
    incorporate_user_response
)
workflow.add_node(
    "generate_story",
    generate_story
)
# Workflow edges
# start-Analyze requirements
workflow.add_edge(
    START,
    "validate_input"
)

# Route based on completeness and feature size
workflow.add_conditional_edges(
    "validate_input",
    route_after_validation,
    {
        "valid": "analyze_requirements",
        "invalid":"reject_invalid_input"
    }
)
workflow.add_edge(
    "reject_invalid_input",
    END
)
workflow.add_conditional_edges(
    "analyze_requirements",
    route_after_requirements,
    {
        "clarification": "clarification",
        "small_feature": "generate_story",
        "large_feature": "generate_story"
    }
)
workflow.add_edge(
    "clarification",
    "incorporate_user_response"
)
workflow.add_edge(
    "incorporate_user_response",
    "generate_story"
)
workflow.add_edge(
    "generate_story",
     END
)
# compile the workflow
memory = InMemorySaver()
graph = workflow.compile(
    checkpointer=memory
)