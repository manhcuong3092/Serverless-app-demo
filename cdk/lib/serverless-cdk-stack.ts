import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as path from "path";

export class ServerlessCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create an IAM role for the Lambda function
    const role = new iam.Role(this, "MyTestLambdaRole", {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AWSLambdaBasicExecutionRole"
        ),
      ],
    });

    // Create a new Lambda function
    const lambdaFn = new lambda.Function(this, "ExpressLambdaFunction", {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset(path.join(__dirname, "../../src")),
      handler: "./handlers/server.handler",
      role: role,
    });

    // Add the necessary permissions for the Lambda function to access resources
    lambdaFn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
        ],
        resources: ["arn:aws:logs:*:*:*"],
      })
    );

    // Create an API Gateway REST API
    const api = new apigw.RestApi(this, "ExpressApi", {
      restApiName: "Express REST API",
    });

    const integration = new apigw.LambdaIntegration(lambdaFn);

    const proxyResource = api.root.addResource("{proxy+}");
    proxyResource.addMethod("ANY", integration);
  }
}
