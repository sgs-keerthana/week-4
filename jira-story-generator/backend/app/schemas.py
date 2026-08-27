from pydantic import BaseModel, Field
from typing import Literal

class Requirements(BaseModel):
    actor: str | None=None
    feature: str = Field(description="The functionality the user wants")
    business_value: str | None=None
    technical_context: str | None = None
    is_large_feature: bool = False
    implementation_areas: list[str] = Field(default_factory=list)
    # used to decide whether clarification is needed
    is_complete: bool = True
    missing_information: list[str]=Field(default_factory=list)
    clarification_question: str | None=None

class JiraStory(BaseModel):
    Summary: str = Field(description="Short standardized Jira story title")
    description: str = Field(description="Detailed explanation of the feature, including business context," \
                                         "objectives, assumptions, and expected behavior")
    as_a: str = Field(description="User role or persona")
    i_want: str = Field(description="Action or functionality the user wants")
    so_that: str = Field(description="Business value or benefit")
    acceptance_criteria: list[str]=Field(
        description="Testable acceptance criteria"
    )
    functional_requirements: list[str]
    technical_considerations: list[str]
    suggested_subtasks: list[str] = Field(
        description="Suggested development subtasks"
    )
    story_points: int = Field(
        description="Suggested story point estimate: 1, 2, 3, 5, or 8"
    )

class StoryGenerationResult(BaseModel):
    is_large_feature: bool
    decomposition_summary: str
    stories: list[JiraStory]

