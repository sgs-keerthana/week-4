import { useState } from "react";

function StoryResult({ result }) {

    if (!result) {
        return null;
    }

    const [stories, setStories] = useState(
        result.stories || []
    );

    const [approvedStories, setApprovedStories] = useState([]);


    // Update normal fields
    const updateField = (
        storyIndex,
        field,
        value
    ) => {

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


    // Update array fields
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

                const updatedArray = [
                    ...(story[field] || [])
                ];

                updatedArray[itemIndex] = value;

                return {
                    ...story,
                    [field]: updatedArray
                };
            })
        );
    };


    // Approve story
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


    const isApproved = (storyIndex) => {
        return approvedStories.includes(storyIndex);
    };


    return (

        <section className="result-card">

            {/* =========================
                SECTION HEADER
            ========================= */}

            <div className="section-heading">

                <div>

                    <span className="eyebrow">
                        LLM #2 OUTPUT
                    </span>

                    <h2>
                        Generated Jira Stories
                    </h2>

                    <p>
                        Review, edit and approve the
                        generated Jira stories.
                    </p>

                </div>

                <div className="story-count">

                    {stories.length}
                    {stories.length === 1
                        ? " STORY"
                        : " STORIES"}

                </div>

            </div>


            {/* =========================
                DECOMPOSITION SUMMARY
            ========================= */}

            <div className="decomposition-box">

                <span>
                    DECOMPOSITION SUMMARY
                </span>

                <p>
                    {result.decomposition_summary}
                </p>

            </div>


            {/* =========================
                STORIES
            ========================= */}

            {stories.map((story, storyIndex) => (

                <article
                    className="story"
                    key={storyIndex}
                >

                    {/* STORY HEADER */}

                    <div className="story-header">

                        <div className="story-number">
                            {String(storyIndex + 1).padStart(2, "0")}
                        </div>

                        <div className="story-title-area">

                            <span>
                                JIRA STORY
                            </span>

                            <h3>
                                {story.Summary || "Untitled Story"}
                            </h3>

                        </div>

                        {isApproved(storyIndex) && (
                            <div className="approved-badge">
                                ✓ APPROVED
                            </div>
                        )}

                    </div>


                    {/* =========================
                        SUMMARY
                    ========================= */}

                    <div className="field-group">

                        <label>
                            Summary
                        </label>

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

                    </div>


                    {/* =========================
                        DESCRIPTION
                    ========================= */}

                    <div className="field-group">

                        <label>
                            Description
                        </label>

                        <textarea
                            rows={4}
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

                    </div>


                    {/* =========================
                        USER STORY
                    ========================= */}

                    <div className="user-story">

                        <div className="user-story-heading">

                            <span className="user-story-icon">
                                👤
                            </span>

                            <div>

                                <h4>
                                    User Story
                                </h4>

                                <p>
                                    Standard Jira user story format
                                </p>

                            </div>

                        </div>


                        <div className="user-story-grid">

                            <div className="field-group">

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

                            </div>


                            <div className="field-group">

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

                            </div>


                            <div className="field-group full-width">

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

                        </div>

                    </div>


                    {/* =========================
                        ACCEPTANCE CRITERIA
                    ========================= */}

                    <StoryListField
                        title="Acceptance Criteria"
                        description="Conditions that must be satisfied for the story to be accepted."
                        field="acceptance_criteria"
                        items={story.acceptance_criteria}
                        storyIndex={storyIndex}
                        disabled={isApproved(storyIndex)}
                        updateArrayItem={updateArrayItem}
                    />


                    {/* =========================
                        FUNCTIONAL REQUIREMENTS
                    ========================= */}

                    <StoryListField
                        title="Functional Requirements"
                        description="What the system must do."
                        field="functional_requirements"
                        items={story.functional_requirements}
                        storyIndex={storyIndex}
                        disabled={isApproved(storyIndex)}
                        updateArrayItem={updateArrayItem}
                    />


                    {/* =========================
                        TECHNICAL CONSIDERATIONS
                    ========================= */}

                    <StoryListField
                        title="Technical Considerations"
                        description="Technical constraints or implementation considerations."
                        field="technical_considerations"
                        items={story.technical_considerations}
                        storyIndex={storyIndex}
                        disabled={isApproved(storyIndex)}
                        updateArrayItem={updateArrayItem}
                    />


                    {/* =========================
                        SUGGESTED SUBTASKS
                    ========================= */}

                    <StoryListField
                        title="Suggested Subtasks"
                        description="Possible implementation tasks for this story."
                        field="suggested_subtasks"
                        items={story.suggested_subtasks}
                        storyIndex={storyIndex}
                        disabled={isApproved(storyIndex)}
                        updateArrayItem={updateArrayItem}
                    />


                    {/* =========================
                        STORY POINTS
                    ========================= */}

                    <div className="story-points-section">

                        <div>

                            <label>
                                Story Points
                            </label>

                            <p>
                                Estimated effort for this story
                            </p>

                        </div>

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

                    </div>


                    {/* =========================
                        APPROVAL
                    ========================= */}

                    <div className="approval-section">

                        {!isApproved(storyIndex) ? (

                            <button
                                className="approve-button"
                                onClick={() =>
                                    approveStory(storyIndex)
                                }
                            >
                                ✓ Approve Story
                            </button>

                        ) : (

                            <div className="approved-message">
                                <span>✓</span>
                                Story Approved
                            </div>

                        )}

                    </div>

                </article>

            ))}

        </section>
    );
}


/* =========================================================
   REUSABLE LIST FIELD
========================================================= */

function StoryListField({
    title,
    description,
    field,
    items,
    storyIndex,
    disabled,
    updateArrayItem
}) {

    return (

        <div className="story-list-section">

            <div className="list-header">

                <div>

                    <h4>
                        {title}
                    </h4>

                    <p>
                        {description}
                    </p>

                </div>

                <span className="item-count">
                    {items?.length || 0}
                </span>

            </div>


            <div className="list-items">

                {items?.map((item, itemIndex) => (

                    <div
                        className="list-item"
                        key={itemIndex}
                    >

                        <span className="item-number">
                            {itemIndex + 1}
                        </span>

                        <textarea
                            rows={2}
                            value={item}
                            disabled={disabled}
                            onChange={(event) =>
                                updateArrayItem(
                                    storyIndex,
                                    field,
                                    itemIndex,
                                    event.target.value
                                )
                            }
                        />

                    </div>

                ))}

            </div>

        </div>
    );
}


export default StoryResult;