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
async function createProject(req: Request, res: Response): Promise<Response> {
	try {
		const { name, description }: { name: string; description: string } = req.body;
		const project: Project = await projectService.createProject(name, description);
		return res.status(201).json(project);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error.message });
	}
}

// Get all projects
async function getAllProjects(req: Request, res: Response): Promise<Response> {
	try {
		const page: number | undefined = req.query.page ? +(req.query.page as string) : undefined;
		const limit: number = +(req.query.limit as string);
		const cursor: string | undefined = req.query.cursor as string | undefined;

		let projects: Project[];
		if (cursor) {
			// Cursor-based pagination
			projects = await projectService.getAllProjects(undefined, limit, cursor);
		} else {
			// Offset-based pagination
			projects = await projectService.getAllProjects(page, limit);
		}

		return res.status(200).json(projects);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
}

// Get a project by ID
async function getProjectById(req: Request, res: Response): Promise<Response> {
	try {
		const projectId: string = req.params.id;
		const project: Project = await projectService.getProjectById(projectId);
		if (!project) {
			return res.status(404).json({ message: 'Project not found' });
		}
		return res.status(200).json(project);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
}

// Update a project
async function updateProject(req: Request, res: Response): Promise<Response> {
	try {
		const projectId: string = req.params.id;
		const updatedData: Partial<Project> = req.body;
		const updatedProject: Project = await projectService.updateProject(projectId, updatedData);
		if (!updatedProject) {
			return res.status(404).json({ message: 'Project not found' });
		}
		return res.status(200).json(updatedProject);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
}

// Delete a project
async function deleteProject(req: Request, res: Response): Promise<Response> {
	try {
		const projectId:string = req.params.id;
		const deletedProject: Project = await projectService.deleteProject(projectId);
		if (!deletedProject) {
			return res.status(404).json({ message: 'Project not found' });
		}
		return res.status(200).json({ message: 'Project deleted successfully' });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
}
