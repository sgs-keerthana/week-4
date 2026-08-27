import { useState } from "react";
import FeatureInput from "./components/FeatureInput";
import Clarification from "./components/Clarification";
import StoryResult from "./components/StoryResult";
import RequirementsResult from "./components/RequirementsResult";

function App() {
    // Stores the feature description entered by the user.
    const [featureIdea, setFeatureIdea] = useState("");

    const [status, setStatus] = useState("idle");

    const [question, setQuestion] = useState("");

    const [response, setResponse] = useState("");
    const [requirements, setRequirements] = useState(null);

    const [storyResult, setStoryResult] = useState(null);

    const [loading, setLoading] = useState(false);
    // Creates a unique thread ID for this workflow.
    const [threadId] = useState(
        `jira-story-${Date.now()}`
    );

    // Generate Jira Story
    const generateStory = async () => {
        // Prevent sending an empty feature
        if (!featureIdea.trim()) {
            return;
        }
        // Show loading state.
        setLoading(true);
        setStoryResult(null);

        try {
            // Send the feature to the FastAPI backend
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
            // Convert the backend response into Javascript
            const data = await result.json();
            console.log("API RESPONSE:",data);
            // Clarification required
            if (data.status === "clarification_required") {

                setQuestion(data.question);
                setStatus("clarification");
            // Story generation completed
            } else if (data.status === "completed") {
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


    const submitClarification = async () => {

        if (!response.trim()) {
            return;
        }

        setLoading(true);

        try {
            // Resume the interrupted Langgraph workflow
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

    // Render UI
    return (

        <div className="app">

            <header>

                <h1>
                    Jira Story Generator
                </h1>

                <p>
                    Transform feature requirements into
                    implementation-ready Jira stories.
                </p>

            </header>


            <main>

                {status === "idle" && (

                    <FeatureInput
                        featureIdea={featureIdea}
                        setFeatureIdea={setFeatureIdea}
                        onGenerate={generateStory}
                        loading={loading}
                    />

                )}


                {status === "clarification" && (

                    <Clarification
                        question={question}
                        response={response}
                        setResponse={setResponse}
                        onSubmit={submitClarification}
                        loading={loading}
                    />

                )}


                {status === "completed" && (

                  <>
                    <RequirementsResult
                      requirements={requirements}
                    />

                    <StoryResult
                        result={storyResult}
                    />
                  </>

                )}


                {status === "error" && (

                    <div className="error-card">

                        <h2>
                            Something went wrong
                        </h2>

                        <p>
                            Please check that the backend
                            server is running and try again.
                        </p>

                        <button
                            onClick={() => setStatus("idle")}
                        >
                            Try Again
                        </button>

                    </div>

                )}

            </main>

        </div>
    );
}

export default App;