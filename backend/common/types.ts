import mongoose, { Document } from 'mongoose';

export type Task = {
	_id: mongoose.Types.ObjectId;
	title: string;
	description: string;
	status: 'todo' | 'in-progress' | 'done';
};

export interface Project extends Document {
	name: string;
	description: string;
	tasks: mongoose.Types.ObjectId[]; // Array of Task references
}
