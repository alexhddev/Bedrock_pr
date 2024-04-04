import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { join } from 'path';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';
export class TsStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const ragLambda = new NodejsFunction(this, 'Ts-TextLambda', {
            runtime: Runtime.NODEJS_20_X,
            handler: 'handler',
            entry: (join(__dirname, '..', 'services', 'Rag.ts')),
            timeout: cdk.Duration.seconds(30),
        })

        ragLambda.addToRolePolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            actions: [
                'bedrock:RetrieveAndGenerate',
                'bedrock:Retrieve',
                'bedrock:InvokeModel',
                'bedrock:InvokeAgent',
            ],
            resources: ['*']
        }))

        const api = new RestApi(this, 'TS-RagApi');

        const textResource = api.root.addResource('text');

        const summaryIntegration = new LambdaIntegration(ragLambda);

        textResource.addMethod('POST', summaryIntegration);



    }
}
