from langchain_community.llms import Bedrock

model = Bedrock(
    model_id="amazon.titan-text-express-v1",
    region_name="eu-central-1"
)

response = model.invoke("Tell me a joke")

print(response)

