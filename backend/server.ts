import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import authRouter from './routes/auth_routes';
import usersRouter from './routes/user_routes';
import http from 'http';
import { connectDb } from './config/db';
import express from 'express';
import projectRouter from './routes/project_routes';
import taskRouter from './routes/task_routes';

require('dotenv').config();

const app = express();
const corsOptions = {
	origin: [
		'http://127.0.0.1:5173',
		'http://127.0.0.1:5174',
		'http://127.0.0.1:8080',
		'http://localhost:8080',
		'http://127.0.0.1:3000',
		'http://localhost:3000',
		'http://localhost:3001',
		'http://127.0.0.1:3001/',
		'http://127.0.0.1:27017/',
		'http://localhost:27017',
	],
	withCredentials: true,
	exposedHeaders: ['set-cookie'],
};
app.use(cors(corsOptions));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/project', projectRouter);
app.use('/api/task', taskRouter);


const server = http.createServer(app);
connectDb(process.env.MONGO_URL);

server.listen(process.env.PORT || 3001, () => console.log('Server started at port http://localhost:' + process.env.PORT));
