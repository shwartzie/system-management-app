import { Request, Response, NextFunction } from 'express';
import { GetUserCommand, InitiateAuthCommand } from '@aws-sdk/client-cognito-identity-provider';
import { cognito } from '../config/aws';



export async function authenticateUser(req: Request, res: Response, next: NextFunction) {
	const accessToken = req.headers['authorization']?.split(' ')[1];
	let refreshToken = req.headers['x-refresh-token'];
	const expiresIn = parseInt(req.headers['x-expires-in'] as string, 10);
	const tokenIssuedAt = parseInt(req.headers['x-token-issued-at'] as string, 10);
	if (accessToken === '' && refreshToken === '' && !expiresIn && !tokenIssuedAt) {
		return res.status(401).json({ message: 'No token provided' });
	}
	if (Array.isArray(refreshToken)) {
		refreshToken = refreshToken[0]; // Take the first value if it's an array
	}

	let errorMsg: string = '';
	try {
		const command = new GetUserCommand({ AccessToken: accessToken });
		await cognito.send(command);
		next();
		return;
	} catch (error) {
		errorMsg = 'Invalid token';
	}

	try {
		const { newRefreshToken, newAccessToken, newTokenIssuedAt, newExpiresIn } = await getNewTokenByRefreshToken(
			expiresIn,
			refreshToken,
			tokenIssuedAt
		);
		res.setHeader('authorization', `Bearer ${newAccessToken || accessToken}`);
		res.setHeader('x-expires-in', (newExpiresIn || expiresIn).toString());
		res.setHeader('x-refresh-token', newRefreshToken || refreshToken);
		errorMsg = '';
		next();
		return;
	} catch (err) {
		errorMsg = 'Invalid Refresh token';
	}

	return res.status(401).json({ message: errorMsg });
}

export async function getUserAttributes(accessToken: string) {
	const command = new GetUserCommand({ AccessToken: accessToken });
	const response = await cognito.send(command);
	return response.UserAttributes.reduce((acc, attr) => {
		acc[attr.Name] = attr.Value;
		return acc;
	}, {} as Record<string, string>);
}

async function getNewTokenByRefreshToken(expiresIn: number, refreshToken: string, tokenIssuedAt: number) {
	const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
	const timeElapsed = currentTime - tokenIssuedAt;
	if (timeElapsed >= expiresIn ) {
	try {
		const refreshCommand = new InitiateAuthCommand({
			AuthFlow: 'REFRESH_TOKEN_AUTH',
			ClientId: process.env.CLIENT_ID!,
			AuthParameters: {
				REFRESH_TOKEN: refreshToken,
			},
		});

		const refreshResponse = await cognito.send(refreshCommand);
		const newAccessToken = refreshResponse.AuthenticationResult?.AccessToken;
		const newExpiresIn = refreshResponse.AuthenticationResult?.ExpiresIn;
		const newRefreshToken = refreshResponse.AuthenticationResult?.RefreshToken;
		return { newRefreshToken, newAccessToken, newTokenIssuedAt: currentTime, newExpiresIn };
	} catch (error) {
		console.error('error getting refresh token:', error);
		throw error;
	}
	}
}
