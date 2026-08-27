function Clarification({
    question,
    response,
    setResponse,
    onSubmit,
    loading
}) {
    return(
        <div className="clarification-card">
            {/* Section heading */}
            <h2>
                Additional Information Required
            </h2>

            {/* Display the question */}
            <p>{question}</p>

            <textarea

                // Current answer.
                value={response}
                onChange={(event) => setResponse(event.target.value)}
                placeholder="Enter your answer..."
                rows={5}
        />

        {/* Submit clarification. this calls resume-story */}
        <button
                onClick={onSubmit}
                disabled={
                    loading || !response.trim()
                }
        >
            {loading
                 ? "Processing..."
                 : "Continue"
            }
        </button>
    </div>

    );
}

export default Clarification;