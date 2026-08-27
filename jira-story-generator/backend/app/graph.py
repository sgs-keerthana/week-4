import json
from langgraph.types import interrupt
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.graph import StateGraph, START, END
from typing import TypedDict
from app.schemas import Requirements, StoryGenerationResult
from app.prompts import requirements_prompt, jira_story_prompt
from app.model import requirements_model, story_model

# Shared state used by all Langgraph nodes
class JiraStoryState(TypedDict, total=False):
    feature_idea: str
    requirements: Requirements
    clarification_question: str
    user_response: str
    story_result: StoryGenerationResult
    validation_result: bool

# LLM#1 STRUCTURED MODEL
requirements_structured_model = (requirements_model.with_structured_output(Requirements))
requirements_chain = (requirements_prompt | requirements_structured_model)

#LLM #2
story_structured_model = (story_model.with_structured_output(StoryGenerationResult))
story_generation_chain = (jira_story_prompt | story_structured_model)


# Node 1: Analyze the user's feature requirements
def analyze_requirements(state: JiraStoryState):

    print("\n[Node] Analyze Requirements")

    requirements = requirements_chain.invoke({
        "feature_idea": state["feature_idea"]
    })
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

# Routing-Decide what happens after completeness check
def route_after_requirements(state: JiraStoryState):
    #First check whether clarification is required
    if not state["requirements"].is_complete:
        return "clarification"

    # Requirement is complete, now check feature size
    if state["requirements"].is_large_feature:
        return "large_feature"
    return "small_feature"
# Create the Langgraph workflow
workflow = StateGraph(JiraStoryState)

# Register nodes
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
    "analyze_requirements"
)

# Route based on completeness and feature size
workflow.add_conditional_edges(
    "analyze_requirements",
    route_after_requirements,
    {
        "clarification":"clarification",
        "small_feature":"generate_story",
        "large_feature":"generate_story"
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