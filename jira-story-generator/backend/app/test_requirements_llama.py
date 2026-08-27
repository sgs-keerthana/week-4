from model import requirements_model
from schemas import Requirements

structured_model = requirements_model.with_structured_output(
    Requirements
)

feature = """
Users should receive an email notification when their order
has been successfully shipped. The existing email notification
service should be used.
"""

print("===== TESTING REQUIREMENTS WITH LLAMA =====")

result = structured_model.invoke(feature)

print("\n===== RESULT =====")
print(result)