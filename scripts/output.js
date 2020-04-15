const keys = [
  "AWSRegion",
  "CognitoIdentityPoolId",
  "CognitoUserPoolWebClientId",
  "CognitoDomain",
  "CognitoUserPoolId",
  "CognitoScope",
  "CognitoRedirectSignIn",
  "CognitoRedirectSignOut",
  "CognitoOAuthResponseType",
  // lambda stuff
  "SignedURLLambdaEndpoint",
];

function handler(data) {
  console.log(data);
  for (let key in data) {
    if (!keys.includes(key)) {
      delete data[key];
    }
  }
}

module.exports = { handler };
