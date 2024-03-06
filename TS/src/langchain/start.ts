import { Bedrock } from "@langchain/community/llms/bedrock";

const model = new Bedrock({
    model: 'amazon.titan-text-express-v1',
    region: 'eu-central-1'
})

async function main() {
    const response = await model.invoke('Tell me a joke')
    console.log(response)
}

main();