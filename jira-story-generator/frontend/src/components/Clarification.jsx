function Clarification({
    question,
    response,
    setResponse,
    onSubmit,
    loading
}) {

    return (
        <div className="clarification-wrapper">

            <div className="clarification-card">

                <div className="clarification-icon">
                    ?
                </div>

                <div className="clarification-content">

                    <span className="eyebrow">
                        REQUIREMENT CLARIFICATION
                    </span>

                    <h2>
                        We need one more detail
                    </h2>

                    <p className="clarification-description">
                        To generate an accurate Jira story,
                        the AI needs some additional information.
                    </p>


                    <div className="question-box">

                        <span>
                            QUESTION
                        </span>

                        <p>
                            {question}
                        </p>

                    </div>


                    <label htmlFor="clarification">
                        Your answer
                    </label>

                    <textarea
                        id="clarification"
                        value={response}
                        onChange={(event) =>
                            setResponse(event.target.value)
                        }
                        placeholder="Enter your answer..."
                        rows={5}
                    />


                    <div className="clarification-actions">

                        <button
                            className="continue-button"
                            onClick={onSubmit}
                            disabled={
                                loading ||
                                !response.trim()
                            }
                        >
                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    Continue →
                                </>
                            )}
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Clarification;