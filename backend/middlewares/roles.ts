import { Request, Response, NextFunction } from 'express';
import * as auth from './user_auth';

export const isRole = (allowedRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
	try {
		const accessToken: string | undefined = req.headers.authorization?.split(' ')[1];
		if (!accessToken) {
			return res.status(401).json({ message: 'No token provided' });
		}

		const userAttributes: Record<string, string> = await auth.getUserAttributes(accessToken);
		const userRole: string =
			userAttributes.profile === process.env.ROLE_ATTRIBUTE ? process.env.ROLE_ATTRIBUTE : 'guest';
		if (!allowedRoles.includes(userRole)) {
			return res.status(403).json({ message: 'Access forbidden' });
		}
		next();
	} catch (err) {
		console.error('Error in role middleware:', err);
		return res.status(500).json({ message: 'Internal server error' });
	}
};
