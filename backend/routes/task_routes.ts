import express from 'express';
import { taskController } from '../controllers/task_controller';
const taskRouter = express.Router();
import { authenticateUser } from '../middlewares/user_auth';
import * as roleMiddleware from '../middlewares/roles';

taskRouter.post('/', authenticateUser, roleMiddleware.isRole(['admin']), taskController.createTask);
taskRouter.get('/', authenticateUser, roleMiddleware.isRole(['admin', 'guest']), taskController.getAllTasks);
taskRouter.get('/:id', authenticateUser, roleMiddleware.isRole(['admin', 'guest']), taskController.getTaskById);
taskRouter.put('/:id', authenticateUser, roleMiddleware.isRole(['admin']), taskController.updateTask);
taskRouter.delete('/:id', authenticateUser, roleMiddleware.isRole(['admin']), taskController.deleteTask);

export default taskRouter;
