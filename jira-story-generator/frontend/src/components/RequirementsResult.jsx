function RequirementsResult({ requirements }) {

    if (!requirements) {
        return null;
    }

    return (
        <section className="requirements-card">

            <div className="section-heading">

                <div>
                    <span className="eyebrow">
                        LLM #1 OUTPUT
                    </span>

                    <h2>
                        Requirements Analysis
                    </h2>

                    <p>
                        Extracted and validated requirements
                        from the feature description.
                    </p>
                </div>

                <div className="analysis-badge">
                    ✓ ANALYZED
                </div>

            </div>


            <div className="requirements-grid">

                <div className="requirement-box">

                    <span>ACTOR</span>

                    <strong>
                        {requirements.actor || "Not specified"}
                    </strong>

                </div>


                <div className="requirement-box">

                    <span>FEATURE</span>

                    <strong>
                        {requirements.feature || "Not specified"}
                    </strong>

                </div>


                <div className="requirement-box">

                    <span>BUSINESS VALUE</span>

                    <strong>
                        {requirements.business_value ||
                            "Not specified"}
                    </strong>

                </div>


                <div className="requirement-box">

                    <span>TECHNICAL CONTEXT</span>

                    <strong>
                        {requirements.technical_context ||
                            "Not specified"}
                    </strong>

                </div>

            </div>


            <div className="requirement-status-row">

                <div className="status-item">

                    <span className="status-dot"></span>

                    <div>
                        <span>Feature Size</span>

                        <strong>
                            {requirements.is_large_feature
                                ? "Large Feature"
                                : "Single Story"}
                        </strong>
                    </div>

                </div>


                <div className="status-item">

                    <span className="status-dot"></span>

                    <div>
                        <span>Completeness</span>

                        <strong>
                            {requirements.is_complete
                                ? "Complete"
                                : "Incomplete"}
                        </strong>
                    </div>

                </div>

            </div>


            <div className="list-section">

                <h3>
                    Implementation Areas
                </h3>

                {requirements.implementation_areas?.length > 0 ? (

                    <div className="tag-list">

                        {requirements.implementation_areas.map(
                            (area, index) => (
                                <span
                                    className="tag"
                                    key={index}
                                >
                                    {area}
                                </span>
                            )
                        )}

                    </div>

                ) : (
                    <p className="muted">
                        None specified
                    </p>
                )}

            </div>


            {requirements.missing_information?.length > 0 && (

                <div className="missing-section">

                    <h3>
                        Missing Information
                    </h3>

                    <ul>

                        {requirements.missing_information.map(
                            (item, index) => (
                                <li key={index}>
                                    {item}
                                </li>
                            )
                        )}

                    </ul>

                </div>

            )}

        </section>
    );
}

export default RequirementsResult;