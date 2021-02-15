import express from 'express';
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
} from '../controller/user.js';
import { protect } from '../middleware/authMiddleware.js';

const userRouter = express.Router();

userRouter.route('/').post(registerUser);
userRouter.route('/login').post(authUser);
userRouter
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

export default userRouter;
