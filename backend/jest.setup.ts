import { connectDb } from './config/db';
import './jest.config';
require('dotenv').config();
connectDb(process.env.MONGO_URL);
import './models/Task';
import './models/Project';
