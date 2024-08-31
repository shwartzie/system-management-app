import { Request, Response } from 'express';
import { taskService } from '../services/task_service';
import { projectService } from '../services/project_service';
import mongoose from 'mongoose';
import { Project, Task } from '../common/types';

export const taskController = {
	createTask,
	getAllTasks,
	getTaskById,
	updateTask,
	deleteTask,
};

// Create a new task
async function createTask(req: Request, res: Response) {
	try {
		const { projectId, title, description, status } = req.body;
		const task: Task = await taskService.createTask(projectId, title, description, status);
		res.status(201).json(task);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}

// Get all tasks
async function getAllTasks(req: Request, res: Response) {
	try {
		const page: number | undefined = req.query.page ? parseInt(req.query.page as string) : undefined;
		const limit: number = parseInt(req.query.limit as string);
		const cursor: string | undefined = req.query.cursor as string | undefined;
		// const projectId:string = req.query.projectId;
		let tasks: Task[];
		if (cursor) {
			// Cursor-based pagination
			tasks = await taskService.getAllTasks(undefined, limit, cursor);
		} else {
			// Offset-based pagination
			tasks = await taskService.getAllTasks(page, limit);
		}

		res.status(200).json(tasks);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}

// Get a task by ID
async function getTaskById(req: Request, res: Response) {
	try {
		const taskId = req.params.id;
		const task: Task = await taskService.getTaskById(taskId);
		if (!task) {
			return res.status(404).json({ message: 'Task not found' });
		}
		res.status(200).json(task);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}

// Update a task
async function updateTask(req: Request, res: Response) {
	try {
		const taskId = req.params.id;
		const updatedData: Task = req.body;
		const updatedTask: Task = await taskService.updateTask(taskId, updatedData);
		if (!updatedTask) {
			return res.status(404).json({ message: 'Task not found' });
		}
		res.status(200).json(updatedTask);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}

// Delete a task
async function deleteTask(req: Request, res: Response) {
	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		const taskId: string = req.params.id;
		const projectId: string = req.params.projectId;
		const deletedTask: Task = await taskService.deleteTask(taskId);
		if (!deletedTask) {
			return res.status(404).json({ message: 'Task not found' });
		}
		const result: Project = await projectService.removeTaskFromProject(projectId, taskId);
		await session.commitTransaction();
		session.endSession();
		res.status(200).json({ message: 'Task deleted successfully' });
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		res.status(500).json({ error: error.message });
	}
}
