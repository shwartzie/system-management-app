import { Project } from '../../common/types';
import { projectService } from '../../services/project_service';

describe('Project Service', () => {
	let createdProjectId: string | null = null; // Store the created project ID

	beforeEach(() => {
		jest.resetAllMocks();
	});

	afterEach(async () => {
		if (createdProjectId) {
			await projectService.deleteProject(createdProjectId); // Clean up after each test
			createdProjectId = null; // Reset for the next test
		}
	});

	afterAll(() => {
		jest.resetAllMocks();
	});

	it('should create a project', async () => {
		const result: Project = await projectService.createProject('Test Project', 'Test Description');
		createdProjectId = result._id.toString();
		expect(result.name).toEqual('Test Project');
		expect(result.description).toEqual('Test Description');
	});

	it('should get all projects', async () => {
		const result: Project[] = await projectService.getAllProjects(1, 10);
		expect(result.length).toBeGreaterThan(0);
	});

	it('should get a project by ID', async () => {
		const newProj: Project = await projectService.createProject('Test Project', 'Test Description');
		createdProjectId = newProj._id.toString();
		const result = await projectService.getProjectById(newProj._id.toString());
		expect(result.name).toEqual(newProj.name);
		expect(result.description).toEqual(newProj.description);
	});

	it('should update a project', async () => {
		const newProj: Project = await projectService.createProject('Test Project', 'Test Description');
		createdProjectId = newProj._id.toString();
		const result = await projectService.updateProject(newProj._id as string, { name: 'Updated Project' });
		expect(result._id).toEqual(newProj._id);
		expect(result.name).toEqual('Updated Project');
	});

	it('should delete a project', async () => {
		const newProj: Project = await projectService.createProject('Test Project', 'Test Description');
		createdProjectId = newProj._id.toString();
		const result = await projectService.deleteProject(newProj._id as string);
		expect(newProj._id).toEqual(result._id);
	});
});
