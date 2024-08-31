import { authenticateUser } from '../middlewares/user_auth';
import { deleteUser, getAllusers, updateUser } from '../controllers/user_controller';
import express from 'express';

const usersRouter = express.Router();
usersRouter.get('/all', authenticateUser, getAllusers);
usersRouter.delete('/delete/:id',authenticateUser, deleteUser);
usersRouter.patch('/update/:id',authenticateUser, updateUser);
export default usersRouter;
