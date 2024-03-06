import { BedrockClient, ListFoundationModelsCommand, GetFoundationModelCommand,  } from '@aws-sdk/client-bedrock'

const client = new BedrockClient({ region: 'eu-central-1' })

async function listFoundationModels() {
    const response = await client.send(new ListFoundationModelsCommand({}))
    console.log(response)
}

async function getModelInfo() {
    const response = await client.send(new GetFoundationModelCommand({
        modelIdentifier: 'amazon.titan-text-express-v1'
    }))
    console.log(response)
}

getModelInfo()