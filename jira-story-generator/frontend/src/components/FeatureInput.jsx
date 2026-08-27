// Component for collecting the feature idea from the user.
function FeatureInput({
    featureIdea,
    setFeatureIdea,
    onGenerate,
    loading
}) {

    return (

        <div className="input-card">

            {/* Input label */}
            <label htmlFor="feature">

                Describe your feature

            </label>
            <textarea
                id="feature"

                // Current input value.
                value={featureIdea}

                // Update featureIdea whenever
                // the user types.
                onChange={(event) =>
                    setFeatureIdea(event.target.value)
                }

                // Helpful example.
                placeholder="Example: Support agents should be able to search previous customer orders using an order ID..."

                rows={8}
            />
            <button
                onClick={onGenerate}
                disabled={
                    loading ||
                    !featureIdea.trim()
                }
            >

                {loading
                    ? "Generating..."
                    : "Generate Jira Story"
                }

            </button>

        </div>
    );
}


// Export component.
export default FeatureInput;