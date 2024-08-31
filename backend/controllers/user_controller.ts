import express from 'express';
import { deleteUserById, getUserById, getUsers } from '../models/User';

// Get all users exsited in DB.
export const getAllusers = async (req: express.Request, res: express.Response) => {
	try {
		const user = await getUsers();

		return res.status(200).json(user).end();
	} catch (err) {
		return res.sendStatus(400).json({ massage: err.massage });
	}
};

// Delete user by id.
export const deleteUser = async (req: express.Request, res: express.Response) => {
	try {
		const { id } = req.params;
		const deleteUser = await deleteUserById(id);

		return res.json(deleteUser).end();
	} catch (err) {
		return res.sendStatus(400).json({ massage: err.massage });
	}
};
// Update user by id.
export const updateUser = async (req: express.Request, res: express.Response) => {
	try {
		const { id } = req.params;
		const { username } = req.body;
		// Error if input is empty.
		if (!username) {
			return res.sendStatus(403);
		}

		const user = await getUserById(id);
		user.username = username;
		await user.save();

		return res.json(user).end();
	} catch (err) {
		return res.sendStatus(400).json({ massage: err.massage });
	}
};
