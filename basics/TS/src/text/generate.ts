import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'

const client = new BedrockRuntimeClient({ region: 'us-west-2' })

async function invokeModel() {

    const titan_config = {
        inputText: 'Tell me a story about a dragon.',
        textGenerationConfig : {
            maxTokenCount: 4096,
            stopSequences: [],
            temperature: 0,
            topP: 1,
        },
    };
    const titanModelId = 'amazon.titan-text-express-v1';

    const llamaConfig = {
        prompt: 'Generate a story about a jazzman named Vincent and an actress named Mia.',
        // max_gen_len: 512,
        temperature: 0,
        top_p: 0.9,
    }
    const llamaModelId = "meta.llama2-13b-chat-v1"



    const response = await client.send(new InvokeModelCommand({
        body: JSON.stringify(llamaConfig),
        
        modelId: llamaModelId,
        contentType: 'application/json',
        accept: 'application/json',
    }))
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    // console.log(responseBody) // titan
    console.log(responseBody.generation) // llama
}
invokeModel()