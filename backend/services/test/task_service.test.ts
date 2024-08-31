import { TaskModel } from '../../models/Task';
import { ProjectModel } from '../../models/Project';
import { taskService } from '../../services/task_service';
import { Task } from '../../common/types';

describe('Task Service', () => {
	let mockTask;
	let mockProject;

	beforeEach(async () => {
		mockTask = new TaskModel({ title: 'Test Task', description: 'Test Description', status: 'todo' });
		await mockTask.save();

		mockProject = new ProjectModel({ name: 'Test Project', description: 'Test Description', tasks: [mockTask] });
		await mockProject.save();

		jest.resetAllMocks();
	});
	afterAll(() => {
		jest.resetAllMocks();
	});

	it('should create a task', async () => {
		const result: Task = await taskService.createTask(
			mockProject._id,
			mockTask.title,
			mockTask.description,
			mockTask.status
		);
		const savedTask = await taskService.getTaskById(result._id.toString());
		expect(savedTask.title).toEqual(result.title);
	});

	it('should get all tasks', async () => {
		const result: Task[] = await taskService.getAllTasks();
		expect(result.length).toBeGreaterThan(0);

	});

	it('should get a task by ID', async () => {
		const result: Task = await taskService.getTaskById(mockTask._id);
		expect(result.title).toEqual(mockTask.title);
	});

	it('should update a task', async () => {
		const result: Task = await taskService.updateTask(mockTask._id, { title: 'Updated Task' });
		expect(result.title).toEqual('Updated Task');
	});

	it('should delete a task', async () => {
		const result: Task = await taskService.deleteTask(mockTask._id);
		expect(result._id).toEqual(mockTask._id);

		const removedTask: Task = await taskService.getTaskById(result._id.toString());
		expect(removedTask).toEqual(null);
	});
});
