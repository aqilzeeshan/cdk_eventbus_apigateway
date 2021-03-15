import * as apigw from '@aws-cdk/aws-apigateway';
import * as cdk from '@aws-cdk/core';

//This will allow you to share your API Client with users and they know what the requests and responses are supposed to look like.

export function getModel(scope: cdk.Stack, restAPI: apigw.IRestApi): apigw.Model {
  return new apigw.Model(scope, "MyModel", {
    restApi: restAPI,
    contentType: "application/json",
    schema: {
      schema: apigw.JsonSchemaVersion.DRAFT7,
      title: "User",
      type: apigw.JsonSchemaType.OBJECT,
      properties: {
          "UserID": {
              type: apigw.JsonSchemaType.STRING,
              description: "This is the UserID Description"
          },
          "LanguageName": {
              type: apigw.JsonSchemaType.STRING,
              pattern: '^[a-z]{2}-[a-z]{2}$'
          }
      },
      required: ["UserID", "LanguageName"]
    }
  });
}
