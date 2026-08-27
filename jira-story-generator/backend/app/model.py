from langchain_ollama import ChatOllama

requirements_model=ChatOllama(
    model="llama3.2:latest",
    temperature=0,
    think=False,
    num_predict=2048
)

story_model = ChatOllama(
    model="llama3.2:latest",
    temperature=0,
    num_predict=4096
)