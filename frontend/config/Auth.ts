import * as config from './config.json';


const AuthConfig = {
        region: config.AWSRegion,
        userPoolId: config.CognitoUserPoolId,
        userPoolWebClientId: config.CognitoUserPoolWebClientId,
        oauth: {
            domain: config.CognitoDomain,
            scope: config.CognitoScope.split(','),
            redirectSignIn: config.CognitoRedirectSignIn,
            redirectSignOut: config.CognitoRedirectSignOut,
            responseType: config.CognitoOAuthResponseType
        }

};

export { AuthConfig }
