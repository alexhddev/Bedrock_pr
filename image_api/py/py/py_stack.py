from aws_cdk import (
    Stack,
    aws_apigateway,
    aws_lambda,
    aws_s3,
    aws_iam,
    Duration
)
from constructs import Construct

class PyImageApiStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        images_bucket = aws_s3.Bucket(self, 'PY-ImagesPyBucket')

        images_lambda = aws_lambda.Function(
            self,
            "Py-ImageLambda",
            runtime=aws_lambda.Runtime.PYTHON_3_11,
            code=aws_lambda.Code.from_asset("services"),
            handler="image.handler",
            environment={
                "BUCKET_NAME": images_bucket.bucket_name
            },
            timeout=Duration.seconds(30)

        )

        images_bucket.grant_read_write(images_lambda)

        images_lambda.add_to_role_policy(aws_iam.PolicyStatement(
            effect=aws_iam.Effect.ALLOW,
            resources=["*"],
            actions=["bedrock:InvokeModel"]            
        ))

        api = aws_apigateway.RestApi(self, "PY-ImageApi")
        cors_options = aws_apigateway.CorsOptions(
            allow_origins=aws_apigateway.Cors.ALL_ORIGINS,
            allow_methods=aws_apigateway.Cors.ALL_METHODS,
        )

        image_resource = api.root.add_resource("image", default_cors_preflight_options=cors_options)
        image_integration = aws_apigateway.LambdaIntegration(images_lambda)
        image_resource.add_method("POST", image_integration)
