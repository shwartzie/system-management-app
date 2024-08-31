import request from 'supertest';
import { app } from '../../jest.setup';

describe('Task Controller', () => {
    let mockTask: { title: string; description: string; status: string };
    let createdTaskId: string;

    beforeEach(async () => {
        mockTask = { title: 'Test Task', description: 'Test Description', status: 'todo' };
        jest.resetAllMocks();
    });

    afterEach(async () => {
        if (createdTaskId) {
            await request(app).delete(`/task/${createdTaskId}`);
            createdTaskId = ''; // Reset for the next test
        }
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    test('should create a new task', async () => {
        const response = await request(app)
            .post('/task')
            .send(mockTask);

        createdTaskId = response.body._id; 

        expect(response.status).toBe(201);
        expect(response.body.title).toEqual(mockTask.title);
        expect(response.body.description).toEqual(mockTask.description);
        expect(response.body.status).toEqual(mockTask.status);
    });

    test('should get all tasks with pagination', async () => {
        const response = await request(app).get('/task').query({ page: 1, limit: 10 });
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
    });

    test('should get a task by ID', async () => {
        const createdRes = await request(app)
            .post('/task')
            .send(mockTask);

        createdTaskId = createdRes.body._id; 

        const response = await request(app).get(`/task/${createdTaskId}`);
        expect(response.status).toBe(200);
        expect(response.body._id).toEqual(createdTaskId);
        expect(response.body.title).toEqual(mockTask.title);
    });

    test('should update a task', async () => {
        const createdRes = await request(app)
            .post('/task')
            .send(mockTask);

        createdTaskId = createdRes.body._id; 

        const updateResponse = await request(app)
            .put(`/task/${createdTaskId}`)
            .send({ title: 'Updated Task', description: 'Updated Description', status: 'in-progress' });

        expect(updateResponse.status).toBe(200);
        expect(updateResponse.body.title).toEqual('Updated Task');
        expect(updateResponse.body.description).toEqual('Updated Description');
        expect(updateResponse.body.status).toEqual('in-progress');
    });

    test('should delete a task', async () => {
        const createdRes = await request(app)
            .post('/task')
            .send(mockTask);

        createdTaskId = createdRes.body._id; 

        const deleteResponse = await request(app).delete(`/task/${createdTaskId}`);
        expect(deleteResponse.status).toBe(200);

        // Attempt to get the deleted task
        const response = await request(app).get(`/task/${createdTaskId}`);
        expect(response.status).toBe(404); // Expect 404 if the task is not found
    });
});
