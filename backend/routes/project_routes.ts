import express from 'express';
import { projectController } from '../controllers/project_controller';
const projectRouter = express.Router();
// Project Routes
import { authenticateUser } from '../middlewares/user_auth';
import * as roleMiddleware from '../middlewares/roles';

projectRouter.post('/', authenticateUser, roleMiddleware.isRole(['admin']), projectController.createProject);
projectRouter.get('/', authenticateUser, roleMiddleware.isRole(['admin',"guest"]),projectController.getAllProjects);
projectRouter.get('/:id', authenticateUser, roleMiddleware.isRole(['admin',"guest"]),projectController.getProjectById);
projectRouter.put('/:id', authenticateUser, roleMiddleware.isRole(['admin']),projectController.updateProject);
projectRouter.delete('/:id', authenticateUser, roleMiddleware.isRole(['admin']),projectController.deleteProject);

export default projectRouter;
