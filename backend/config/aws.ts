import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import AWS from 'aws-sdk';

// Set up AWS Cognito configuration
AWS.config.update({
    region: process.env.REGION, // e.g., 'us-east-1'
    credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: process.env.USER_POOL_ID,
    }),
});

export const cognito = new CognitoIdentityProviderClient({
	region: process.env.REGION,
	credentials: {
		accessKeyId: process.env.ACCESS_KEY,
		secretAccessKey: process.env.SECRET_ACCESS_KEY,
	},
});
