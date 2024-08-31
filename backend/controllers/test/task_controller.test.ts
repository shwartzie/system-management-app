import request from 'supertest';
import express from 'express';
import { taskController } from '../task_controller'; // Import your Task controller
// Create an Express app for testing
const app = express();
app.use(express.json());
app.post('/tasks', taskController.createTask);
app.get('/tasks', taskController.getAllTasks);
app.get('/tasks/:id', taskController.getTaskById);
app.put('/tasks/:id', taskController.updateTask);
app.delete('/tasks/:id', taskController.deleteTask);

describe('Task Controller', () => {
	let mockTask;
	beforeEach(async () => {
		mockTask = { title: 'Test Task', description: 'Test Description', status: 'todo' };
		jest.resetAllMocks();
	});
    afterAll(() => {
		jest.resetAllMocks();
    })
	test('should create a new task', async () => {
		const response = await request(app)
			.post('/tasks')
			.send(mockTask);
		expect(response.status).toBe(201);
		expect(response.body.title).toEqual(mockTask.title);
		expect(response.body.description).toEqual(mockTask.description);
		expect(response.body.status).toEqual(mockTask.status);
	});

	test('should get all tasks with pagination', async () => {
		const response = await request(app).get('/tasks').query({ page: 1, limit: 10 });
		expect(response.status).toBe(200);
		expect(response.body.length).toBeGreaterThan(0);
	});

	test('should get a task by ID', async () => {
		const createdRes = await request(app)
			.post('/tasks')
			.send(mockTask);

		const response = await request(app).get('/tasks/' + createdRes.body._id);
		expect(response.status).toBe(200);
		expect(response.body._id).toEqual(createdRes.body._id);
		expect(response.body.title).toEqual(mockTask.title);
	});

	test('should update a task', async () => {
		const createdRes = await request(app)
			.post('/tasks')
			.send(mockTask);

		const updateResponse = await request(app)
			.put('/tasks/' + createdRes.body._id)
			.send({ title: 'Updated Task', description: 'Updated Description', status: 'in-progress' });

		expect(updateResponse.status).toBe(200);
		expect(updateResponse.body.title).toEqual('Updated Task');
		expect(updateResponse.body.description).toEqual('Updated Description');
		expect(updateResponse.body.status).toEqual('in-progress');
	});

	test('should delete a task', async () => {
		const createdRes = await request(app)
			.post('/tasks')
			.send(mockTask);

		const deleteResponse = await request(app).delete('/tasks/' + createdRes.body._id);
		expect(deleteResponse.status).toBe(200);

		const response = await request(app).get('/tasks/' + createdRes.body._id);
		expect(response.status).toBe(404); // Expect 404 if task is not found
	});
});
