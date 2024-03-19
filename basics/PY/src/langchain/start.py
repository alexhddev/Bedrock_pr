from langchain_community.llms import Bedrock
import boto3

AWS_REGION = 'us-west-2'

bedrock=boto3.client(
    service_name="bedrock-runtime",
    region_name=AWS_REGION)

model = Bedrock(
    model_id = "amazon.titan-text-express-v1",
    client=bedrock
)

response = model.invoke("What is the highest mountain in the world?")
print(response)
