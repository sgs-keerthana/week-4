## 🤖 Jira Story Generator
An AI-powered application that converts natural-language feature requirements into structured, implementation-ready Jira user stories.

The application analyzes requirements, detects missing information, asks clarification questions when required, identifies large features, and generates Jira stories with acceptance criteria, functional requirements, technical considerations, subtasks, and story points.

## Features
- Natural-language feature input
- AI-based requirements analysis
- Actor identification
- Feature identification
- Business value extraction
- Technical context extraction
- Implementation area identification
- Missing information detection
- Clarification questions using Human-in-the-Loop
- Small and large feature identification
- Large feature decomposition
- Jira story generation
- Acceptance criteria generation
- Functional requirements generation
- Technical considerations
- Suggested development subtasks
- Story point estimation
- Human review and approval through UI

## Technology stack
- Frontend: React, JavaScript
- Backend: Python, FastAPI
- AI Workflow: LangGraph
- LLM Framework: LangChain
- LLM: Llama 3.2
- Local Model Runtime: Ollama
- Data Validation:Pydantic

## Installation
- Python
- Node.js
- npm
- Ollama
- Git

## Ollama setup
- ollama pull llama3.2:latest

## Backend setup
- cd backend
- python -m venv venv
- venv\Scripts\activate
- pip install -r requirements.txt
- uvicorn app.api:app --reload

## Frontend setup
- cd frontend
- npm install
- npm run dev

## Requirement Analysis
- The first LLM analyzes the natural-language feature and extracts structured requirements such as actor, feature, business value, technical context, implementation areas, feature size, and missing information. If critical information is missing, the workflow pauses and asks the user a clarification question.

## Jira story generation
- Once the requirements are complete, the second LLM generates implementation-ready Jira stories containing the summary, user story, acceptance criteria, functional requirements, technical considerations, suggested subtasks, and story points. The generated output is validated using Pydantic structured models.

## Human-in-the-Loop
- When clarification is required, LangGraph uses 'interrupt()' to pause the workflow. The user provides the missing information through the UI, and the workflow resumes using the same thread ID through '/resume-story'.

## Workflow

                    USER
                      │
                      ▼
             React Frontend
                      │
             Enter Feature Idea
                      │
                      ▼
             Generate Jira Story
                      │
                      │ POST /generate-story
                      ▼
              FastAPI Backend
                      │
                      ▼
              LangGraph Workflow
                      │
                      ▼
          ┌──────────────────────┐
          │ Analyze Requirements  │
          │      LLM #1           │
          └──────────┬───────────┘
                     │
                     ▼
             Requirements Object
                     │
                     ▼
           Is information complete?
                /          \
              NO            YES
              │              │
              ▼              ▼
       Clarification      Is it a
          Question       large feature?
              │           /       \
              │         YES        NO
              │          │          │
              ▼          ▼          ▼
        interrupt()   Generate    Generate
              │        Stories     Story
              │          │          │
              ▼          └────┬─────┘
        User answers          │
              │               │
              ▼               │
       /resume-story          │
              │               │
              ▼               │
   Incorporate User Response  │
              │               │
              └───────┬───────┘
                      ▼
              Generate Jira Story
                    LLM #2
                      │
                      ▼
            StoryGenerationResult
                      │
                      ▼
                FastAPI Response
                      │
                      ▼
                React Frontend
                      │
                      ▼
                Requirements UI
                      │
                      ▼
                  Story UI
                      │
                      ▼
              Human Review/Edit
                      │
                      ▼
                   Approve

## Project structure
jira-story-generator/
│
├── backend/
│   ├── app/
│   │   ├── api.py
│   │   ├── graph.py
│   │   ├── prompts.py
│   │   ├── schemas.py
│   │   └── model.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FeatureInput.jsx
│   │   │   ├── Clarification.jsx
│   │   │   ├── RequirementsResult.jsx
│   │   │   └── StoryResult.jsx
│   │   └── App.jsx
│   └── package.json
│
├── .gitignore
└── README.md

## Architecture diagram
fflowchart TD

    USER["User"]

    FRONTEND["React Frontend"]

    API["FastAPI Backend"]

    ANALYZE["Analyze Requirements<br/>LLM 1"]

    REQUIREMENTS["Requirements Object<br/>Pydantic"]

    COMPLETE{"Requirements Complete?"}

    CLARIFY["Ask Clarification"]

    INTERRUPT["interrupt()"]

    RESPONSE["User Provides<br/>Clarification Response"]

    RESUME["POST /resume-story<br/>Command(resume=response)"]

    INCORPORATE["Incorporate User Response"]

    LARGE{"Large Feature?"}

    GENERATE["Generate Jira Story<br/>LLM 2"]

    STORY["StoryGenerationResult<br/>Pydantic"]

    RESULT["Requirements + Jira Stories"]

    USER --> FRONTEND

    FRONTEND -->|"POST /generate-story"| API

    API --> ANALYZE

    ANALYZE --> REQUIREMENTS

    REQUIREMENTS --> COMPLETE

    COMPLETE -->|"No"| CLARIFY

    CLARIFY --> INTERRUPT

    INTERRUPT -->|"Clarification Question"| API

    API --> FRONTEND

    FRONTEND --> RESPONSE

    RESPONSE --> RESUME

    RESUME --> API

    API --> INCORPORATE

    INCORPORATE --> GENERATE

    COMPLETE -->|"Yes"| LARGE

    LARGE -->|"Small Feature"| GENERATE

    LARGE -->|"Large Feature"| GENERATE

    GENERATE --> STORY

    STORY --> RESULT

    RESULT --> FRONTEND

    FRONTEND --> USER