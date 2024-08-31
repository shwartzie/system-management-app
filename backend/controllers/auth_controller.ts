import express from 'express';
require('dotenv').config();
import { authService } from '../services/auth_service';
import { SignUpCommandOutput } from '@aws-sdk/client-cognito-identity-provider';
export const register = async (req: express.Request, res: express.Response): Promise<express.Response> => {
	try {
		const { email, password, username, phoneNumber } = req.body;
		if (!email || !password || !username || !phoneNumber) {
			return res.status(400).json({ message: 'Missing required fields' });
		}

		const response: SignUpCommandOutput = await authService.register(email, password, username, phoneNumber);
		return res.status(response.$metadata.httpStatusCode).json({ message: 'User created successfully' });
	} catch (err) {
		// Ensure proper error handling
		console.error('Error during registration:', err);
		return res.status(400).json({ message: err.message || 'Registration failed' });
	}
};

export const login = async (req: express.Request, res: express.Response): Promise<express.Response> => {
	try {
		const { username, password }: { username: string; password: string } = req.body;
		if (!username || !password) {
			return res.status(400).json({ message: 'Username and password are required' });
		}

		const response = await authService.login(username, password);
		res.setHeader('authorization', `Bearer ${response.accessToken}`);
		res.setHeader('x-refresh-token', response.refreshToken);
		res.setHeader('x-expires-in', response.expiresIn.toString());
		res.setHeader('x-token-issued-at', response.tokenIssuedAt.toString());
		return res.status(response.status).json({ message: 'success' });
	} catch (err) {
		console.error('Error during login:', err);
		return res.status(400).json({ message: err.message || 'Login failed' });
	}
};

// export const respondToMFAChallenge = async (req: express.Request, res: express.Response) => {
// 	try {
// 		const { username, mfaCode, session } = req.body; // Get MFA code from the user
// 		console.log('respondToMFAChallenge starting', req.body);
// 		if (!mfaCode || !session) {
// 			return res.status(400).json({ message: 'MFA code and session are required' });
// 		}

// 		const response = await authService.respondMFA(username, mfaCode, session)

// 		return res.status(response.$metadata.httpStatusCode).json({
// 			accessToken: response.AuthenticationResult?.AccessToken,
// 			idToken: response.AuthenticationResult?.IdToken,
// 			refreshToken: response.AuthenticationResult?.RefreshToken,
// 		});
// 	} catch (err) {
// 		console.error('Error during MFA response:', err);
// 		return res.status(400).json({ message: err.message || 'MFA failed' });
// 	}
// };
