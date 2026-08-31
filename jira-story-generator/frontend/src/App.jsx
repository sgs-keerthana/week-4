import { useState } from "react";
import FeatureInput from "./components/FeatureInput";
import Clarification from "./components/Clarification";
import StoryResult from "./components/StoryResult";
import RequirementsResult from "./components/RequirementsResult";

function App() {
    const [featureIdea, setFeatureIdea] = useState("");
    const [status, setStatus] = useState("idle");
    const [question, setQuestion] = useState("");
    const [response, setResponse] = useState("");
    const [requirements, setRequirements] = useState(null);
    const [storyResult, setStoryResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const [threadId] = useState(
        `jira-story-${Date.now()}`
    );

    const generateStory = async () => {
        if (!featureIdea.trim()) {
            return;
        }

        setLoading(true);
        setStoryResult(null);

        try {
            const result = await fetch(
                "http://127.0.0.1:8000/generate-story",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        feature_idea: featureIdea,
                        thread_id: threadId
                    })
                }
            );

            const data = await result.json();

            console.log("API RESPONSE:", data);

            if (data.status === "clarification_required") {
                setQuestion(data.question);
                setStatus("clarification");
            } else if (data.status === "completed") {
                setRequirements(data.requirements);
                setStoryResult(data.story_result);
                setStatus("completed");
            } else if (data.status === "invalid_input") {
                setStatus("invalid");
            }
            else {
                setStatus("error");
            }

        } catch (error) {
            console.error(error);
            setStatus("error");

        } finally {
            setLoading(false);
        }
    };


    const submitClarification = async () => {
        if (!response.trim()) {
            return;
        }

        setLoading(true);

        try {
            const result = await fetch(
                "http://127.0.0.1:8000/resume-story",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        thread_id: threadId,
                        response: response
                    })
                }
            );

            const data = await result.json();

            if (data.status === "completed") {
                setRequirements(data.requirements);
                setStoryResult(data.story_result);
                setStatus("completed");
            } else {
                setStatus("error");
            }

        } catch (error) {
            console.error(error);
            setStatus("error");

        } finally {
            setLoading(false);
        }
    };


    const createNewStory = () => {
        setFeatureIdea("");
        setQuestion("");
        setResponse("");
        setRequirements(null);
        setStoryResult(null);
        setStatus("idle");
    };


    return (
        <div className="app">

            {/* HEADER */}
            <header className="app-header">

                <div className="header-content">

                    <div className="brand">
                        <div className="brand-icon">
                            ✦
                        </div>

                        <div>
                            <h1>Jira Story Generator</h1>

                            <p>
                                Transform feature ideas into
                                implementation-ready Jira stories.
                            </p>
                        </div>
                    </div>

                    <div className="header-badge">
                        AI POWERED
                    </div>

                </div>

            </header>


            {/* MAIN CONTENT */}
            <main>

                {/* Progress */}
                {status !== "idle" && status !== "error" && (
                    <div className="progress-bar">

                        <div
                            className={
                                status === "completed"
                                    ? "progress-step active"
                                    : "progress-step current"
                            }
                        >
                            <span>1</span>
                            Analyze
                        </div>

                        <div className="progress-line"></div>

                        <div
                            className={
                                status === "clarification"
                                    ? "progress-step current"
                                    : status === "completed"
                                        ? "progress-step active"
                                        : "progress-step"
                            }
                        >
                            <span>2</span>
                            Clarify
                        </div>

                        <div className="progress-line"></div>

                        <div
                            className={
                                status === "completed"
                                    ? "progress-step active"
                                    : "progress-step"
                            }
                        >
                            <span>3</span>
                            Generate
                        </div>

                    </div>
                )}


                {/* INPUT */}
                {status === "idle" && (
                    <FeatureInput
                        featureIdea={featureIdea}
                        setFeatureIdea={setFeatureIdea}
                        onGenerate={generateStory}
                        loading={loading}
                    />
                )}


                {/* CLARIFICATION */}
                {status === "clarification" && (
                    <Clarification
                        question={question}
                        response={response}
                        setResponse={setResponse}
                        onSubmit={submitClarification}
                        loading={loading}
                    />
                )}


                {/* COMPLETED */}
                {status === "completed" && (
                    <>
                        <div className="success-banner">
                            <div className="success-icon">
                                ✓
                            </div>

                            <div>
                                <strong>
                                    Jira story generated successfully
                                </strong>

                                <p>
                                    Your requirements have been analyzed
                                    and converted into Jira-ready stories.
                                </p>
                            </div>

                            <button
                                className="new-story-button"
                                onClick={createNewStory}
                            >
                                + New Story
                            </button>
                        </div>

                        <RequirementsResult
                            requirements={requirements}
                        />

                        <StoryResult
                            result={storyResult}
                        />
                    </>
                )}


                {/* ERROR */}
                {status === "error" && (
                    <div className="error-card">

                        <div className="error-icon">
                            !
                        </div>

                        <h2>
                            Something went wrong
                        </h2>

                        <p>
                            We couldn't generate your Jira story.
                            Please make sure the backend server is running
                            and try again.
                        </p>

                        <button
                            onClick={() => setStatus("idle")}
                        >
                            Try Again
                        </button>

                    </div>
                )}
                {status === "invalid" &&(
                    <div className="error-card">
                        <h2>
                            Invalid Feature Request
                        </h2>
                        <p>
                            Please provide a software feature or
                            product requirement that can be converted
                            into a Jira story
                        </p>
                        <button
                            onClick={() => setStatus("idle")}
                        >
                            Try Again
                        </button>
                    </div>
                )}
            </main>

            <footer>
                <span>Jira Story Generator</span>
                <span>AI-assisted requirement analysis</span>
            </footer>

        </div>
    );
}

export default App;