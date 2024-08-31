import { connectDb } from './config/db';
import express from 'express';
import './jest.config';
require('dotenv').config();
connectDb(process.env.MONGO_URL);
import './models/Task';
import './models/Project';

const app = express();
app.use(express.json());

import { projectController } from './controllers/project_controller';
import { login } from './controllers/auth_controller'; // Adjust the path
import { taskController } from './controllers/task_controller';
app.post('/project', projectController.createProject);
app.get('/project', projectController.getAllProjects);
app.get('/project/:id', projectController.getProjectById);
app.put('/project/:id', projectController.updateProject);
app.delete('/project/:id', projectController.deleteProject);

app.post('/login', login);

app.post('/task/', taskController.createTask);
app.get('/task/', taskController.getAllTasks);
app.get('/task/:id', taskController.getTaskById);
app.put('/task/:id', taskController.updateTask);
app.delete('/task/:id', taskController.deleteTask);

export { app };
