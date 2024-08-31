import express from 'express';
import request from 'supertest';
import { Task } from '../../common/types';
import { projectController } from '../project_controller';

const app = express();
app.use(express.json());
app.post('/projects', projectController.createProject);
app.get('/projects', projectController.getAllProjects);
app.get('/projects/:id', projectController.getProjectById);
app.put('/projects/:id', projectController.updateProject);
app.delete('/projects/:id', projectController.deleteProject);

describe('Project Controller', () => {
	let mockProject:{ name: string, description: string, tasks: Task[] };
	beforeEach(async () => {
		mockProject = { name: 'Test Project', description: 'Test Description', tasks: [] };
		jest.resetAllMocks();
	});
	afterAll(() => {
		jest.resetAllMocks();
    })
	test('should create a new project', async () => {
		const response = await request(app)
			.post('/projects')
			.send({ name: 'Test Project', description: 'Test Description' });
		expect(response.status).toBe(201);
		expect(response.body.name).toEqual(mockProject.name);
	});

	test('should get all projects with pagination', async () => {
		const response = await request(app).get('/projects').query({ page: 1, limit: 10 });
		expect(response.status).toBe(200);
		expect(response.body.length).toBeGreaterThan(0); 
	});

	test('should get a project by ID', async () => {
		const createdRes = await request(app)
			.post('/projects')
			.send({ name: 'Test Project', description: 'Test Description' });

		const response = await request(app).get('/projects/' + createdRes.body._id);
		expect(response.status).toBe(200);
		expect(response.body._id).toEqual(createdRes.body._id);
	});

	test('should update a project', async () => {
		const createdRes = await request(app)
			.post('/projects')
			.send({ name: 'Test Project', description: 'Test Description' });

		const response = await request(app)
			.put('/projects/' + createdRes.body._id)
			.send({ name: 'Updated Project', description: 'Updated Description' });

		expect(response.status).toBe(200);
		expect(response.body.name).toEqual('Updated Project');
		expect(response.body.description).toEqual('Updated Description');
	});

	test('should delete a project', async () => {
		const createdRes = await request(app)
			.post('/projects')
			.send({ name: 'Test Project', description: 'Test Description' });

		const deleteResponse = await request(app).delete('/projects/' + createdRes.body._id);
		expect(deleteResponse.status).toBe(200);
		const response = await request(app).get('/projects/' + deleteResponse.body._id);
		expect(response.status).toBe(500);
	});
});
