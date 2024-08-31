import { Project } from '../common/types';
import { ProjectModel } from '../models/Project';
export const projectService = {
	getAllProjects,
	getProjectById,
	deleteProject,
	updateProject,
	createProject,
	removeTaskFromProject,
};

async function getAllProjects(page: number = 1, limit: number = 10, cursor?: string): Promise<Project[]> {
	if (cursor) {
		// Cursor-based pagination
		return await ProjectModel.find({ _id: { $gt: cursor } })
			.populate('tasks')
			.limit(limit)
			.exec();
	} else {
		// Offset-based pagination
		const skip = (page - 1) * limit;
		return await ProjectModel.find().populate('tasks').skip(skip).limit(limit).exec();
	}
}

async function getProjectById(projectId: string): Promise<Project> {
	return await ProjectModel.findById(projectId).populate('tasks').exec();
}

async function createProject(name: string, description: string): Promise<Project> {
	const project = new ProjectModel({ name, description });
	await project.save();
	return project;
}

async function deleteProject(projectId: string): Promise<Project> {
	return await ProjectModel.findByIdAndDelete(projectId);
}
async function updateProject(projectId: string, updatedData: Partial<Project>): Promise<Project> {
	return await ProjectModel.findByIdAndUpdate(projectId, updatedData, { new: true });
}

async function removeTaskFromProject(projectId: string, taskId: string): Promise<Project> {
	return await ProjectModel.findByIdAndUpdate(projectId, { $pull: { tasks: taskId } });
}
