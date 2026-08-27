from app.graph import graph
from langgraph.types import Command


if __name__ == "__main__":

    feature_idea = """
    Support agents should be able to search previous customer orders
    using an order ID so they can answer customer queries faster.
    The existing Order API should be used.
    """

    config = {
        "configurable": {
            "thread_id": "jira-story-final-small-001"
        }
    }

    print("\n----- STARTING JIRA STORY GENERATOR -----")

    # First execution
    result = graph.invoke(
        {
            "feature_idea": feature_idea
        },
        config=config
    )

    # Check whether clarification is required
    if "__interrupt__" in result:

        question = result["__interrupt__"][0].value

        print("\n----- CLARIFICATION REQUIRED -----")
        print(question)

        user_response = (
            "The order lookup feature should be available "
            "in the ticket sidebar."
        )

        print("\n----- RESUMING WORKFLOW -----")

        result = graph.invoke(
            Command(
                resume=user_response
            ),
            config=config
        )

    # Final result
    if "story_result" in result:

        print("\n----- FINAL JIRA STORY -----")
        print(result["story_result"])

    else:

        print("\n----- GRAPH RESULT -----")
        print(result)