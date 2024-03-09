from langchain_openai import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain

model = ChatOpenAI(temperature=0, openai_api_key="xxx")
model.model_kwargs = {"temperature": 0}

memory = ConversationBufferMemory(llm=model, return_messages=False)
chain = ConversationChain(llm=model, memory=memory)

print(
    "Bot: Hello! I am a chatbot. I can help you with anything you want to talk about."
)
while True:
    user_input = input("User: ")
    if user_input.lower() == "exit":
        break
    response = chain.invoke(input=user_input)
    last_message = response["response"][-1]  # Extract the last message
    print(last_message)
