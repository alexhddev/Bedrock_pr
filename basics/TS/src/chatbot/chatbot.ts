import { Bedrock } from "@langchain/community/llms/bedrock";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";

const model = new Bedrock({
    model: 'meta.llama2-13b-chat-v1',
    region: 'us-west-2',
    temperature: 0,

})
const memory = new BufferMemory();
const chain = new ConversationChain({ llm: model, memory: memory });

async function main() {
    console.log('Chatbot is ready. Type a message to start the conversation.')
    process.stdin.addListener('data', async (input) => {
        const userInput = input.toString().trim();
        const response = await chain.invoke({
            input: userInput
        });
        console.log(response)
    })
}

main();