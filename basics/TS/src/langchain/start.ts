import { Bedrock } from "@langchain/community/llms/bedrock";

const AWS_REGION = 'us-west-2'

const model = new Bedrock({
    model: 'amazon.titan-text-express-v1',
    region: AWS_REGION
})

async function main() {
    const response = await model.invoke("What is the highest mountain in the world?");

    console.log(response)
}

main();