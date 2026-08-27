// Component responsible for displaying
// the requirements extracted by LLM #1.

function RequirementsResult({ requirements }) {

    // Do not render anything if requirements
    // have not been received yet.
    if (!requirements) {
        return null;
    }

    return (
        <div className="requirements-card">

            <h2>
                Requirements Analysis
            </h2>

            <div className="requirement-item">
                <strong>Actor</strong>
                <p>
                    {requirements.actor}
                </p>
            </div>

            <div className="requirement-item">
                <strong>Feature</strong>
                <p>
                    {requirements.feature}
                </p>
            </div>

            <div className="requirement-item">
                <strong>Business Value</strong>
                <p>
                    {requirements.business_value}
                </p>
            </div>

            <div className="requirement-item">
                <strong>Technical Context</strong>
                <p>
                    {requirements.technical_context}
                </p>
            </div>

            <div className="requirement-item">
                <strong>Large Feature</strong>
                <p>
                    {requirements.is_large_feature
                        ? "Yes"
                        : "No"}
                </p>
            </div>

            <div className="requirement-item">
                <strong>Requirements Complete</strong>
                <p>
                    {requirements.is_complete
                        ? "Yes"
                        : "No"}
                </p>
            </div>

            <div className="requirement-item">
                <strong>Implementation Areas</strong>

                {requirements.implementation_areas?.length > 0 ? (
                    <ul>
                        {requirements.implementation_areas.map(
                            (area, index) => (
                                <li key={index}>
                                    {area}
                                </li>
                            )
                        )}
                    </ul>
                ) : (
                    <p>
                        None specified
                    </p>
                )}
            </div>

            <div className="requirement-item">
                <strong>Missing Information</strong>

                {requirements.missing_information?.length > 0 ? (
                    <ul>
                        {requirements.missing_information.map(
                            (item, index) => (
                                <li key={index}>
                                    {item}
                                </li>
                            )
                        )}
                    </ul>
                ) : (
                    <p>
                        None
                    </p>
                )}
            </div>

        </div>
    );
}

export default RequirementsResult;