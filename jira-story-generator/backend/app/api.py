from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langgraph.types import Command
from app.graph import graph

# Create FastAPI application
app=FastAPI(title="Jira Story Generator API")

#Allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model for generating a Jira story
class StoryRequest(BaseModel):
    feature_idea: str
    thread_id: str

# Request model for resuming a paused workflow
class ResumeRequest(BaseModel):
    thread_id: str
    response: str

# Root endpoint
@app.get("/")
def root():
    return{
        "message":"Jira Story Generator API is running"
    }

# Generate Jira story endpoint
@app.post("/generate-story")
def generate_story(request: StoryRequest):
    config={
        "configurable":{
            "thread_id":request.thread_id
        }
    }
    # Start the Langgraph workflow
    result = graph.invoke(
        {
            "feature_idea":request.feature_idea
        },
        config=config
    )

    # Check whether Langgraph paused for clarification
    if "__interrupt__" in result:
        # Extract the clarification question
        question = result[
            "__interrupt__"
        ][0].value

        return{
            "status": "clarification_required",
            "thread_id": request.thread_id,
            "question":question
        }
    if "story_result" in result:
        return{
            "status": "completed",
            "thread_id": request.thread_id,
            "requirements": result[
                "requirements"
            ].model_dump(),
            "story_result": result[
                "story_result"
            ].model_dump()
        }
    # Handle unexpected workflow result
    return{
        "status": "unknown",
        "result": result
    }
#Resume a paused jira story generation workflow
@app.post("/resume-story")
def resume_story(request: ResumeRequest):

    #Use the same thread ID to recover the saved workflow state
    config={
        "configurable":{
            "thread_id":request.thread_id
        }
    }

    # Resume the workflow using the user's clarification response
    result = graph.invoke(
        Command(
            resume=request.response
        ),
        config=config
    )

    #Check whether the final Jira story was generated
    if "story_result" in result:
        return{
            "status": "completed",
            "thread_id": request.thread_id,
            "requirements": result[
                "requirements"
            ].model_dump(),
            "story_result": result[
                "story_result"
            ].model_dump()
        }
    # Handle unexpected workflow result
    return{
        "status":"unknown",
        "result":result
    }