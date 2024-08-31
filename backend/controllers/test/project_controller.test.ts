import request from 'supertest';
import { Task } from '../../common/types';
import { app } from '../../jest.setup';

describe('Project Controller', () => {
	let mockProject: { name: string; description: string; tasks: Task[] };
	let createdProjectId: string;
	beforeEach(async () => {
		mockProject = { name: 'Test Project', description: 'Test Description', tasks: [] };
		jest.resetAllMocks();
	});
	afterAll(() => {
		jest.resetAllMocks();
	});
	afterEach(async () => {
		if (createdProjectId) {
			await request(app).delete(`/project/${createdProjectId}`);
			createdProjectId = '';
		}
	});
	test('should create a new project', async () => {
		const response = await request(app)
			.post('/project')
			.send({ name: 'Test Project', description: 'Test Description' });
		expect(response.status).toBe(201);
		expect(response.body.name).toEqual(mockProject.name);
		createdProjectId = response.body._id;
	});

	test('should get all projects with pagination', async () => {
		const response = await request(app).get('/project').query({ page: 1, limit: 10 });
		expect(response.status).toBe(200);
		expect(response.body.length).toBeGreaterThan(0);
	});

	test('should get a project by ID', async () => {
		const createdRes = await request(app)
			.post('/project')
			.send({ name: 'Test Project', description: 'Test Description' });

		const response = await request(app).get('/project/' + createdRes.body._id);
		expect(response.status).toBe(200);
		expect(response.body._id).toEqual(createdRes.body._id);
		createdProjectId = createdRes.body._id;
	});

	test('should update a project', async () => {
		const createdRes = await request(app)
			.post('/project')
			.send({ name: 'Test Project', description: 'Test Description' });

		const response = await request(app)
			.put('/project/' + createdRes.body._id)
			.send({ name: 'Updated Project', description: 'Updated Description' });

		expect(response.status).toBe(200);
		expect(response.body.name).toEqual('Updated Project');
		expect(response.body.description).toEqual('Updated Description');
		createdProjectId = createdRes.body._id;
	});

	test('should delete a project', async () => {
		const createdRes = await request(app)
			.post('/project')
			.send({ name: 'Test Project', description: 'Test Description' });

		const deleteResponse = await request(app).delete('/project/' + createdRes.body._id);
		expect(deleteResponse.status).toBe(200);
		const response = await request(app).get('/project/' + deleteResponse.body._id);
		expect(response.status).toBe(500);
		createdProjectId = createdRes.body._id;
	});
});
