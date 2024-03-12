import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'

const client = new BedrockRuntimeClient({ region: 'us-west-2' })

type HumanMessage = `Human: ${string}`;
type AssistantMessage = `Assistant: ${string}`;

const history: Array<HumanMessage | AssistantMessage> = [];

function getHistory() {
    return history.join('\n');
}

function getConfiguration(){
    return {
        inputText: getHistory(),
        textGenerationConfig : {
            maxTokenCount: 4096,
            stopSequences: [],
            temperature: 0,
            topP: 1,
        },
    };
}

async function main() {
    console.log('Chatbot is ready. Type a message to start the conversation.')
    process.stdin.addListener('data', async (input) => {
        const userInput = input.toString().trim();
        history.push(`Human: ${userInput}`);
        const response = await client.send(new InvokeModelCommand({
            body: JSON.stringify(getConfiguration()),            
            modelId: 'amazon.titan-text-express-v1',
            contentType: 'application/json',
            accept: 'application/json',
        }))
        const responseBody = JSON.parse(new TextDecoder().decode(response.body));
        const outputText = console.log(responseBody.results[0].outputText)
        history.push(`Assistant: ${outputText}`);
    })
}

main()