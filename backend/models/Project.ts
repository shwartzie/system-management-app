import mongoose, { Schema, Document } from 'mongoose';
import { Project } from '../common/types';

// Define the Project interface

// Define the Project schema
const projectSchema = new Schema<Project>({
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
});

const ProjectModel = mongoose.model<Project>('Project', projectSchema);

export { ProjectModel };
