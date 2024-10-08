import {
	AdminInitiateAuthCommand,
	AdminInitiateAuthCommandOutput,
	CognitoIdentityProviderClient,
	ConfirmForgotPasswordCommand,
	RespondToAuthChallengeCommand,
	RespondToAuthChallengeCommandOutput,
	SignUpCommand,
	SignUpCommandOutput,
} from '@aws-sdk/client-cognito-identity-provider';

import { cognito } from '../config/aws';

type LoginResponse = {
	status: number;
	accessToken: string;
	refreshToken: string;
	expiresIn: number;
	tokenIssuedAt: number;
};

type AuthService = {
	register: (username: string, password: string, email: string, phoneNumber: string) => Promise<SignUpCommandOutput>;
	cognito: CognitoIdentityProviderClient;
	login: (username: string, password: string) => Promise<LoginResponse>;
};

export const confirmResetPassword = async (username: string) => {
	try {
		const command: ConfirmForgotPasswordCommand = new ConfirmForgotPasswordCommand({
			ClientId: process.env.CLIENT_ID!,
			Username: username,
			ConfirmationCode: '020819',
			Password: 'a12345',
		});

		await authService.cognito.send(command);
	} catch (err) {
		console.error('Error confirming password reset:', err);
	}
};

export const authService: AuthService = {
	register,
	cognito,
	login,
};

async function register(username: string, password: string, email: string, phoneNumber: string) {
	const command = new SignUpCommand({
		ClientId: process.env.CLIENT_ID,
		Username: username,
		Password: password,
		UserAttributes: [
			{ Name: 'email', Value: email },
			{ Name: 'phone_number', Value: phoneNumber },
			{ Name: 'profile', Value: 'guest' },
		],
	});

	return await cognito.send(command);
}

async function login(username: string, password: string): Promise<LoginResponse> {
	const initiateAuthCommand = new AdminInitiateAuthCommand({
		UserPoolId: process.env.USER_POOL_ID!,
		ClientId: process.env.CLIENT_ID!,
		AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
		AuthParameters: {
			USERNAME: username,
			PASSWORD: password,
		},
	});
	const initiateAuthResponse: AdminInitiateAuthCommandOutput = await cognito.send(initiateAuthCommand);
	const { Session, ChallengeParameters, ChallengeName } = initiateAuthResponse;
	const tokenIssuedAt: number = Math.floor(Date.now() / 1000);

	if (ChallengeName === 'NEW_PASSWORD_REQUIRED') {
		const challengeResponses = {
			NAME: username,
			USERNAME: username, // Ensure USERNAME is provided
			NEW_PASSWORD: password, // Provide the new password
		};
		// If ChallengeParameters contains any additional required attributes, include them
		if (ChallengeParameters) {
			for (const [key, value] of Object.entries(ChallengeParameters)) {
				if (!(key in challengeResponses)) {
					challengeResponses[key] = value;
				}
			}
		}

		const respondToAuthChallengeCommand: RespondToAuthChallengeCommand = new RespondToAuthChallengeCommand({
			ChallengeName,
			ClientId: process.env.CLIENT_ID!,
			ChallengeResponses: challengeResponses,
			Session: Session!,
		});

		const response: RespondToAuthChallengeCommandOutput = await cognito.send(respondToAuthChallengeCommand);
		return {
			status: response.$metadata.httpStatusCode,
			accessToken: response.AuthenticationResult.AccessToken,
			refreshToken: response.AuthenticationResult.RefreshToken,
			expiresIn: response.AuthenticationResult.ExpiresIn,
			tokenIssuedAt,
		};
	}
	return {
		status: initiateAuthResponse.$metadata.httpStatusCode,
		accessToken: initiateAuthResponse.AuthenticationResult.AccessToken,
		refreshToken: initiateAuthResponse.AuthenticationResult.RefreshToken,
		expiresIn: initiateAuthResponse.AuthenticationResult.ExpiresIn,
		tokenIssuedAt,
	};

	// if (initiateAuthResponse.ChallengeName === 'SMS_MFA') {
	// 	return {status:initiateAuthResponse.$metadata.httpStatusCode, Session }

	// } else if (initiateAuthResponse.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
	// 	const { USER_ID_FOR_SRP } = ChallengeParameters;

	// 	const newPassword = password;

	// 	const respondToAuthChallengeCommand = new AdminRespondToAuthChallengeCommand({
	// 		UserPoolId: process.env.USER_POOL_ID!,
	// 		ClientId: process.env.CLIENT_ID!,
	// 		ChallengeName: 'NEW_PASSWORD_REQUIRED',
	// 		Session: Session!,
	// 		ChallengeResponses: {
	// 			USERNAME: username,
	// 			NEW_PASSWORD: newPassword,
	// 			USER_ID_FOR_SRP,
	// 		},
	// 	});

	// 	const respondToAuthChallengeResponse = await authService.cognito.send(respondToAuthChallengeCommand);
	// 	if (respondToAuthChallengeResponse.ChallengeName === 'SMS_MFA') {
	// 		return {status:respondToAuthChallengeResponse.$metadata.httpStatusCode, Session }
	// 	}
	// } else {
	// 	return {status:initiateAuthResponse.$metadata.httpStatusCode }
	// }
}

async function respondMFA(username: string, mfaCode: string, session: string) {
	const command = new RespondToAuthChallengeCommand({
		ClientId: process.env.CLIENT_ID!,
		ChallengeName: 'SMS_MFA',
		Session: session,
		ChallengeResponses: {
			USERNAME: username,
			SMS_MFA_CODE: mfaCode,
		},
	});

	const response = await authService.cognito.send(command);
	return response;
}
