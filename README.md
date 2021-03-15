* Based on https://eventbus-cdk.workshop.aws/en/04-api-gateway-service-integrations/01-rest-api/rest-apis.html
* Uses Eventbus directly with API Gateway
* Starts from `aws events put-events --entries file://putevents.json` and goes on to dynamic values 
* `curl ${ENDPOINT}english --header 'Content-type:application/json' --data '{"UserID":"1234567","LanguageName":"en-us"}'`
* `curl ${ENDPOINT}french --header 'Content-type:application/json' --data '{"UserID":"abcdefg","LanguageName":"en-gb"}'`
