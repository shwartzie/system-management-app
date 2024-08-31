import { TaskModel } from '../models/Task';
import { ProjectModel } from '../models/Project';
import mongoose from 'mongoose';
import { Task } from '../common/types';

export const taskService: TaskService = {
	createTask,
	getAllTasks,
	getTaskById,
	updateTask,
	deleteTask,
};

type TaskService = {
	createTask: (
		projectId: string,
		title: string,
		description: string,
		status: 'todo' | 'in-progress' | 'done'
	) => Promise<Task>;
	getAllTasks: (page?: number, limit?: number, cursor?: string) => Promise<Task[]>;
	getTaskById: (taskId: string) => Promise<Task>;
	updateTask: (taskId: string, updatedData: Partial<Task>) => Promise<Task>;
	deleteTask: (taskId: string) => Promise<Task>;
};

async function createTask(
	projectId: string,
	title: string,
	description: string,
	status: 'todo' | 'in-progress' | 'done'
): Promise<Task> {
	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		const task = new TaskModel({ title, description, status });
		await task.save();
		await ProjectModel.findByIdAndUpdate(projectId, { $push: { tasks: task._id } });
		await session.commitTransaction();
		session.endSession();
		return task;
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		throw error;
	}
}

// Get all tasks
async function getAllTasks(page: number = 1, limit?: number, cursor?: string): Promise<Task[]> {
	if (cursor) {
		// Cursor-based pagination
		return await TaskModel.find({ _id: { $gt: cursor } })
			.limit(limit)
			.exec();
	} else {
		// Offset-based pagination
		const skip = (page - 1) * limit;
		return await TaskModel.find({}).skip(skip).limit(limit).exec();
	}
}

// Get a task by ID
async function getTaskById(taskId: string): Promise<Task> {
	return await TaskModel.findById(taskId);
}

// Update a task by ID
async function updateTask(taskId: string, updatedData: Partial<Task>): Promise<Task> {
	return await TaskModel.findByIdAndUpdate(taskId, updatedData, { new: true });
}

// Delete a task by ID and remove it from the project's task list
async function deleteTask(taskId: string): Promise<Task> {
	return await TaskModel.findByIdAndDelete(taskId);
}
