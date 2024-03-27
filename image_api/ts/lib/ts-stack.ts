import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { join } from 'path';
import { Cors, LambdaIntegration, ResourceOptions, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Bucket } from 'aws-cdk-lib/aws-s3';

export class TsImageApiStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const imagesBucket = new Bucket(this, 'ImagesBucket-1234', {
            
        })

        const summaryLambda = new NodejsFunction(this, 'Ts-ImageLambda', {
            runtime: Runtime.NODEJS_20_X,
            handler: 'handler',
            entry: (join(__dirname, '..', 'services', 'image.ts')),
            timeout: cdk.Duration.seconds(30),
            environment: {
                BUCKET_NAME: imagesBucket.bucketName
            }
        })

        imagesBucket.grantReadWrite(summaryLambda);

        summaryLambda.addToRolePolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ['bedrock:InvokeModel'],
            resources: ['*']
        }))

        const api = new RestApi(this, 'TS-ImageApi');

        const optionsWithCors: ResourceOptions = {
            defaultCorsPreflightOptions: {
                allowOrigins: Cors.ALL_ORIGINS,
                allowMethods: Cors.ALL_METHODS
            }
        }
        const emplResource = api.root.addResource('image', optionsWithCors);

        const emplLambdaIntegration = new LambdaIntegration(summaryLambda);

        emplResource.addMethod('POST', emplLambdaIntegration);


    }
}
