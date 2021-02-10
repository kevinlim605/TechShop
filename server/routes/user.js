import express from 'express';
import { authUser } from '../controller/user.js';

const userRouter = express.Router();

userRouter.post('/login', authUser);

export default userRouter;
