import request from 'supertest';
import { app } from '../../jest.setup';
require('dotenv').config();

describe('Login Controller', () => {
	beforeEach(async () => {
		jest.resetAllMocks();
	});
	afterAll(() => {
		jest.resetAllMocks();
	});
	test('should return 400 if username or password is missing', async () => {
		const response = await request(app).post('/login').send({});
		expect(response.status).toBe(400);
		expect(response.body.message).toBe('Username and password are required');
	});

	test('should return 200 and set headers if login is successful', async () => {
		const response = await request(app)
			.post('/login')
			.send({ username: process.env.TEST_USER, password: process.env.TEST_PASSWORD });
		console.log('response.headers.authorization:', response.headers.authorization);
		expect(response.status).toBe(200);
		expect(response.headers.authorization).toMatch(/^Bearer .+$/);
		expect(response.headers['x-refresh-token']).toBeDefined();
		expect(response.headers['x-expires-in']).toBeDefined();
		expect(response.headers['x-token-issued-at']).toBeDefined();
		expect(response.body.message).toBe('success');
	});

	test('should handle login failure and return 400', async () => {
		const response = await request(app).post('/login').send({ username: 'wronguser', password: 'wrongpassword' });
		expect(response.status).toBe(400);
		expect(response.body.message).toBe('Incorrect username or password.');
	});
});
