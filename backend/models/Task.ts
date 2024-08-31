import mongoose from 'mongoose';
import { Task } from '../common/types';
const Schema = mongoose.Schema;

const taskSchema = new Schema({
	title: { type: String, required: true },
	description: { type: String },
	status: { type: String, enum: ['todo', 'in progress', 'done'], default: 'todo' },
	// project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
});


const TaskModel = mongoose.model<Task>('Task', taskSchema);
export { TaskModel };
