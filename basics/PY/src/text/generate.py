import boto3
import json
import pprint
brt = boto3.client(service_name='bedrock-runtime', region_name="eu-central-1")

anthropic_config = json.dumps({
    "prompt": "\n\nHuman: explain black holes to 8th graders\n\nAssistant:",
    "max_tokens_to_sample": 300,
    "temperature": 0.1,
    "top_p": 0.9,
})

titan_config = json.dumps({
            "inputText": "Tell me a story about a dragon.",
            "textGenerationConfig": {
                "maxTokenCount": 4096,
                "stopSequences": [],
                "temperature": 0,
                "topP": 1
            }
        })

modelId = 'amazon.titan-text-express-v1'
accept = 'application/json'
contentType = 'application/json'

response = brt.invoke_model(body=titan_config, modelId=modelId, accept=accept, contentType=contentType)

response_body = json.loads(response.get('body').read())

pp = pprint.PrettyPrinter(depth=4)

# text
pp.pprint(response_body.get('results'))