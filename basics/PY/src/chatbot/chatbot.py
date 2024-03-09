from langchain.llms.bedrock import Bedrock
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain

model = Bedrock(model_id="meta.llama2-13b-chat-v1", region_name="us-west-2")
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
    print(response["response"])
