import express from 'express';
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} from '../controller/user.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const userRouter = express.Router();

userRouter.route('/').get(protect, admin, getUsers).post(registerUser);
userRouter.route('/login').post(authUser);
userRouter
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
userRouter
  .route('/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

export default userRouter;
