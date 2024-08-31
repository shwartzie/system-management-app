import { Request, Response } from 'express';
import { projectService } from '../services/project_service';
import { Project } from '../common/types';

export const projectController = {
	createProject,
	getAllProjects,
	getProjectById,
	updateProject,
	deleteProject,
};

// Create a new project
async function createProject(req: Request, res: Response) {
	try {
		const { name, description } = req.body;
		const project: Project = await projectService.createProject(name, description);
		res.status(201).json(project);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
}

// Get all projects
async function getAllProjects(req: Request, res: Response) {
	try {
		const page = req.query.page ? parseInt(req.query.page as string) : undefined;
		const limit = parseInt(req.query.limit as string) || 10;
		const cursor = req.query.cursor as string | undefined;

		let projects: Project[];
		if (cursor) {
			// Cursor-based pagination
			projects = await projectService.getAllProjects(undefined, limit, cursor);
		} else {
			// Offset-based pagination
			projects = await projectService.getAllProjects(page, limit);
		}

		res.status(200).json(projects);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}

// Get a project by ID
async function getProjectById(req: Request, res: Response) {
	try {
		const projectId = req.params.id;
		const project: Project = await projectService.getProjectById(projectId);
		if (!project) {
			return res.status(404).json({ message: 'Project not found' });
		}
		res.status(200).json(project);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}

// Update a project
async function updateProject(req: Request, res: Response) {
	try {
		const projectId = req.params.id;
		const updatedData = req.body;
		const updatedProject: Project = await projectService.updateProject(projectId, updatedData);
		if (!updatedProject) {
			return res.status(404).json({ message: 'Project not found' });
		}
		res.status(200).json(updatedProject);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}

// Delete a project
async function deleteProject(req: Request, res: Response) {
	try {
		const projectId = req.params.id;
		const deletedProject: Project = await projectService.deleteProject(projectId);
		if (!deletedProject) {
			return res.status(404).json({ message: 'Project not found' });
		}
		res.status(200).json({ message: 'Project deleted successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}
