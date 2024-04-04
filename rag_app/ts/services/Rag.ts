import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from "aws-lambda";
import { BedrockAgentRuntimeClient, RetrieveAndGenerateCommand } from '@aws-sdk/client-bedrock-agent-runtime'

const AWS_REGION_BEDROCK = "us-west-2";

const client = new BedrockAgentRuntimeClient({ region: AWS_REGION_BEDROCK });

export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

    if (event.body) {
        const body = JSON.parse(event.body)
        const question = body.question as string
        if (question) {
            const command = new RetrieveAndGenerateCommand({
                input: {
                    text: question
                },
                retrieveAndGenerateConfiguration: {
                    type: 'KNOWLEDGE_BASE',
                    knowledgeBaseConfiguration: {
                        knowledgeBaseId: 'XLBYQE9MF1',
                        modelArn: 'arn:aws:bedrock:us-west-2::foundation-model/anthropic.claude-v2'
                    }
                }
            })
            const response = await client.send(command)
            console.log(response)
        }
    }

    return {} as any
}