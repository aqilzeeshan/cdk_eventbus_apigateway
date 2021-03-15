import * as targets from '@aws-cdk/aws-events-targets';
import * as events from '@aws-cdk/aws-events';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigw from '@aws-cdk/aws-apigateway';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import * as model from './my_model';

export class CdkEventbusApigatewayStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const myLambda = new lambda.Function(this, "MyEventProcessor", {
      code: new lambda.InlineCode("def main(event, context):\n\tprint(event)\n\treturn {'statusCode': 200, 'body': 'Hello, World'}"),
      handler: "index.main",
      runtime: lambda.Runtime.PYTHON_3_7
    })

    const bus = new events.EventBus(this, "MyLanguageBus")
    
    new cdk.CfnOutput(this, "BusName", {value: bus.eventBusName})

    new events.Rule(this, `LambdaProcessorRule`, {
      eventBus: bus,
      eventPattern: {source: [`com.amazon.alexa.english`]},
      targets: [new targets.LambdaFunction(myLambda)]
    })

    //Fill-in eventbus name after deploying stack in test/putevents.json and run the following
    //aws events put-events --entries file://putevents.json
    // navigate to the Lambda Console, then click on Monitoring, then view logs in CloudWatch.

    //A role to be assumed by apigateway service to PutEvents in the EventBus
    const apigwRole = new iam.Role(this, "MYAPIGWRole", {
      assumedBy: new iam.ServicePrincipal("apigateway"),
      inlinePolicies: {
        "putEvents": new iam.PolicyDocument({
          statements: [new iam.PolicyStatement({
            actions: ["events:PutEvents"],
            resources: [bus.eventBusArn]
          })]
        })
      }
    });

    //create an API Gateway REST API    
    const myRestAPI = new apigw.RestApi(this, "MyRestAPI");

    //Make the EventBus routing dynamic
    const languageResource = myRestAPI.root.addResource("{language}");

    const options = {
      credentialsRole: apigwRole,
      requestParameters: {
        "integration.request.header.X-Amz-Target": "'AWSEvents.PutEvents'",
        "integration.request.header.Content-Type": "'application/x-amz-json-1.1'"
      },
      requestTemplates: {
        //Update the requestTemplates portion of your options to place the request body in the detail section of your PutEvents call.
        "application/json": `#set($language=$input.params('language'))\n{"Entries": [{"Source": "com.amazon.alexa.$language", "Detail": "$util.escapeJavaScript($input.body)", "Resources": ["resource1", "resource2"], "DetailType": "myDetailType", "EventBusName": "${bus.eventBusName}"}]}`
      },
      integrationResponses: [{
        statusCode: "200",
        responseTemplates: {
          "application/json": ""
        }
      }]
    }

    languageResource.addMethod("POST", new apigw.Integration({
        type: apigw.IntegrationType.AWS,
        uri: `arn:aws:apigateway:${cdk.Aws.REGION}:events:path//`,
        integrationHttpMethod: "POST",
        options: options // we'll define this in one moment
      }),
      {
        methodResponses: [{
          statusCode: "200"
        }],
        requestModels: {"application/json": model.getModel(this, myRestAPI) },
        requestValidator: new apigw.RequestValidator(this, "myValidator", {
          restApi: myRestAPI,
          validateRequestBody: true
        })
      }
    )

    //https://eventbus-cdk.workshop.aws/en/04-api-gateway-service-integrations/01-rest-api/rest-apis.html


    




  }
}
