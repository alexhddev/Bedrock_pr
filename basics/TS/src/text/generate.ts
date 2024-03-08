import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'

const client = new BedrockRuntimeClient({ region: 'eu-central-1' })

async function invokeModel() {

    const textGenerationConfig = {
        maxTokenCount: 4096,
        stopSequences: [],
        temperature: 0,
        topP: 1,
    };

    const payload = {
        inputText: 'Tell me a story about a dragon.',
        textGenerationConfig,
    };

    const response = await client.send(new InvokeModelCommand({
        body: JSON.stringify(payload),
        
        modelId: 'amazon.titan-text-express-v1',
        contentType: 'application/json',
        accept: 'application/json',
    }))
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    console.log(responseBody)
}
invokeModel()