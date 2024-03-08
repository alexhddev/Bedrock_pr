from langchain.llms.bedrock import Bedrock
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain

model = Bedrock(model_id="amazon.titan-text-express-v1", region_name="eu-central-1")
model.model_kwargs = {
    "temperature": 0
}

memory = ConversationBufferMemory(llm=model)
chain = ConversationChain(llm=model, memory=memory)

print(
    "Bot: Hello! I am a chatbot. I can help you with anything you want to talk about."
)
while True:
    user_input = input()
    if user_input.lower() == "exit":
        break
    response = chain.predict(input=user_input)
    print(response)
