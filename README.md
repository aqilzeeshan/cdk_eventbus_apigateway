* Based on https://eventbus-cdk.workshop.aws/en/04-api-gateway-service-integrations/01-rest-api/rest-apis.html
* Uses Eventbus directly with API Gateway
* Starts from `aws events put-events --entries file://putevents.json` and goes on to dynamic values e.g.
`curl ${ENDPOINT}english --header 'Content-type:application/json' --data '{"UserID":"1234567","LanguageName":"en-us"}'`
`curl ${ENDPOINT}french --header 'Content-type:application/json' --data '{"UserID":"abcdefg","LanguageName":"en-gb"}'`
* Add validations to inputs which are not valid e.g
`
# UserID is missing
curl ${ENDPOINT}english --header 'Content-type:application/json' --data '{"LanguageName":"en-us"}'

# UserID is the wrong 'type'
curl ${ENDPOINT}french --header 'Content-type:application/json' --data '{"UserID":100,"LanguageName":"en-gb"}'

# LanguageName is missing
curl ${ENDPOINT}english --header 'Content-type:application/json' --data '{"UserID":"1234567"}'

# LanguageName doesn't match the pattern we specified
curl ${ENDPOINT}french --header 'Content-type:application/json' --data '{"UserID":"abcdefg","LanguageName":"aaa-bb"}'
`
