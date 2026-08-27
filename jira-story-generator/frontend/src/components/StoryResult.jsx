import { useState } from "react";

function StoryResult({ result }) {

    // If there is no generated result,
    // do not display anything.
    if (!result) {
        return null;
    }

    // Stores the edited version of all Jira stories.
    const [stories, setStories] = useState(
        result.stories || []
    );

    // Stores which stories have been approved.
    const [approvedStories, setApprovedStories] = useState([]);

    // ---------------------------------------------------------
    // Update a normal text field
    // ---------------------------------------------------------
    const updateField = (storyIndex, field, value) => {

        setStories((currentStories) =>
            currentStories.map((story, index) => {

                if (index !== storyIndex) {
                    return story;
                }

                return {
                    ...story,
                    [field]: value
                };
            })
        );
    };


    // ---------------------------------------------------------
    // Update an array field
    // Example:
    // acceptance_criteria
    // functional_requirements
    // technical_considerations
    // suggested_subtasks
    // ---------------------------------------------------------
    const updateArrayItem = (
        storyIndex,
        field,
        itemIndex,
        value
    ) => {

        setStories((currentStories) =>
            currentStories.map((story, index) => {

                if (index !== storyIndex) {
                    return story;
                }

                const updatedArray = [...story[field]];

                updatedArray[itemIndex] = value;

                return {
                    ...story,
                    [field]: updatedArray
                };
            })
        );
    };


    // ---------------------------------------------------------
    // Approve a story
    // ---------------------------------------------------------
    const approveStory = (storyIndex) => {

        setApprovedStories((currentApproved) => {

            if (currentApproved.includes(storyIndex)) {
                return currentApproved;
            }

            return [
                ...currentApproved,
                storyIndex
            ];
        });
    };


    // ---------------------------------------------------------
    // Check whether a particular story is approved
    // ---------------------------------------------------------
    const isApproved = (storyIndex) => {

        return approvedStories.includes(storyIndex);

    };


    return (

        <div className="result-card">

            <h2>
                Generated Jira Stories
            </h2>


            {/* -------------------------------------------------
                Decomposition summary
            -------------------------------------------------- */}
            <p className="decomposition">
                {result.decomposition_summary}
            </p>


            {/* -------------------------------------------------
                Display every generated Jira story
            -------------------------------------------------- */}
            {stories.map((story, storyIndex) => (

                <div
                    className="story"
                    key={storyIndex}
                >

                    {/* =========================================
                        SUMMARY
                    ========================================== */}

                    <h4>
                        Summary
                    </h4>

                    <input
                        type="text"
                        value={story.Summary || ""}
                        disabled={isApproved(storyIndex)}
                        onChange={(event) =>
                            updateField(
                                storyIndex,
                                "Summary",
                                event.target.value
                            )
                        }
                    />


                    {/* =========================================
                        DESCRIPTION
                    ========================================== */}

                    <h4>
                        Description
                    </h4>

                    <textarea
                        value={story.description || ""}
                        disabled={isApproved(storyIndex)}
                        onChange={(event) =>
                            updateField(
                                storyIndex,
                                "description",
                                event.target.value
                            )
                        }
                    />


                    {/* =========================================
                        USER STORY
                    ========================================== */}

                    <div className="user-story">

                        <h4>
                            User Story
                        </h4>


                        <label>
                            As a
                        </label>

                        <input
                            type="text"
                            value={story.as_a || ""}
                            disabled={isApproved(storyIndex)}
                            onChange={(event) =>
                                updateField(
                                    storyIndex,
                                    "as_a",
                                    event.target.value
                                )
                            }
                        />


                        <label>
                            I want
                        </label>

                        <input
                            type="text"
                            value={story.i_want || ""}
                            disabled={isApproved(storyIndex)}
                            onChange={(event) =>
                                updateField(
                                    storyIndex,
                                    "i_want",
                                    event.target.value
                                )
                            }
                        />


                        <label>
                            So that
                        </label>

                        <input
                            type="text"
                            value={story.so_that || ""}
                            disabled={isApproved(storyIndex)}
                            onChange={(event) =>
                                updateField(
                                    storyIndex,
                                    "so_that",
                                    event.target.value
                                )
                            }
                        />

                    </div>


                    {/* =========================================
                        ACCEPTANCE CRITERIA
                    ========================================== */}

                    <h4>
                        Acceptance Criteria
                    </h4>

                    {story.acceptance_criteria?.map(
                        (item, itemIndex) => (

                            <textarea
                                key={itemIndex}
                                value={item}
                                disabled={isApproved(storyIndex)}
                                onChange={(event) =>
                                    updateArrayItem(
                                        storyIndex,
                                        "acceptance_criteria",
                                        itemIndex,
                                        event.target.value
                                    )
                                }
                            />

                        )
                    )}


                    {/* =========================================
                        FUNCTIONAL REQUIREMENTS
                    ========================================== */}

                    <h4>
                        Functional Requirements
                    </h4>

                    {story.functional_requirements?.map(
                        (item, itemIndex) => (

                            <textarea
                                key={itemIndex}
                                value={item}
                                disabled={isApproved(storyIndex)}
                                onChange={(event) =>
                                    updateArrayItem(
                                        storyIndex,
                                        "functional_requirements",
                                        itemIndex,
                                        event.target.value
                                    )
                                }
                            />

                        )
                    )}


                    {/* =========================================
                        TECHNICAL CONSIDERATIONS
                    ========================================== */}

                    <h4>
                        Technical Considerations
                    </h4>

                    {story.technical_considerations?.map(
                        (item, itemIndex) => (

                            <textarea
                                key={itemIndex}
                                value={item}
                                disabled={isApproved(storyIndex)}
                                onChange={(event) =>
                                    updateArrayItem(
                                        storyIndex,
                                        "technical_considerations",
                                        itemIndex,
                                        event.target.value
                                    )
                                }
                            />

                        )
                    )}


                    {/* =========================================
                        SUGGESTED SUBTASKS
                    ========================================== */}

                    <h4>
                        Suggested Subtasks
                    </h4>

                    {story.suggested_subtasks?.map(
                        (item, itemIndex) => (

                            <textarea
                                key={itemIndex}
                                value={item}
                                disabled={isApproved(storyIndex)}
                                onChange={(event) =>
                                    updateArrayItem(
                                        storyIndex,
                                        "suggested_subtasks",
                                        itemIndex,
                                        event.target.value
                                    )
                                }
                            />

                        )
                    )}


                    {/* =========================================
                        STORY POINTS
                    ========================================== */}

                    <h4>
                        Story Points
                    </h4>

                    <input
                        type="number"
                        min="1"
                        max="8"
                        value={story.story_points || ""}
                        disabled={isApproved(storyIndex)}
                        onChange={(event) =>
                            updateField(
                                storyIndex,
                                "story_points",
                                Number(event.target.value)
                            )
                        }
                    />


                    {/* =========================================
                        APPROVE BUTTON
                    ========================================== */}

                    <div className="approval-section">

                        {!isApproved(storyIndex) ? (

                            <button
                                className="approve-button"
                                onClick={() =>
                                    approveStory(storyIndex)
                                }
                            >
                                Approve Story
                            </button>

                        ) : (

                            <div className="approved-message">
                                ✅ Story Approved
                            </div>

                        )}

                    </div>

                </div>

            ))}

        </div>
    );
}

export default StoryResult;