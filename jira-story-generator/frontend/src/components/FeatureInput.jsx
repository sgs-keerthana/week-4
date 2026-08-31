function FeatureInput({
    featureIdea,
    setFeatureIdea,
    onGenerate,
    loading
}) {

    const maxCharacters = 1000;

    return (
        <div className="input-wrapper">

            <div className="page-intro">
                <span className="eyebrow">
                    CREATE A STORY
                </span>

                <h2>
                    What do you want to build?
                </h2>

                <p>
                    Describe your feature in plain language.
                    The AI will analyze the requirements and
                    generate a structured Jira story.
                </p>
            </div>


            <div className="input-card">

                <div className="input-header">

                    <div>
                        <label htmlFor="feature">
                            Feature Description
                        </label>

                        <p>
                            Include the user, feature,
                            and expected outcome if possible.
                        </p>
                    </div>

                    <span className="input-label">
                        FEATURE
                    </span>

                </div>


                <textarea
                    id="feature"
                    value={featureIdea}
                    onChange={(event) =>
                        setFeatureIdea(event.target.value)
                    }
                    placeholder={
                        "Example: Customers should be able to download their invoices so they can easily access their financial records."
                    }
                    rows={9}
                    maxLength={maxCharacters}
                />


                <div className="input-footer">

                    <span className="character-count">
                        {featureIdea.length} / {maxCharacters}
                    </span>

                    <button
                        className="generate-button"
                        onClick={onGenerate}
                        disabled={
                            loading ||
                            !featureIdea.trim()
                        }
                    >
                        {loading ? (
                            <>
                                <span className="spinner"></span>
                                Analyzing...
                            </>
                        ) : (
                            <>
                                ✦ Generate Jira Story
                            </>
                        )}
                    </button>

                </div>

            </div>


            <div className="input-tips">

                <div className="tip">
                    <span>01</span>
                    <div>
                        <strong>Describe the user</strong>
                        <p>Who needs this feature?</p>
                    </div>
                </div>

                <div className="tip">
                    <span>02</span>
                    <div>
                        <strong>Describe the action</strong>
                        <p>What should the user be able to do?</p>
                    </div>
                </div>

                <div className="tip">
                    <span>03</span>
                    <div>
                        <strong>Describe the goal</strong>
                        <p>Why is this feature needed?</p>
                    </div>
                </div>

            </div>

        </div>
    );
}

export default FeatureInput;