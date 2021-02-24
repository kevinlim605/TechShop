import express from 'express';
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  getOrders,
  updateOrderToDelivered,
  updateOrderToPaid,
} from '../controller/order.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const orderRouter = express.Router();

orderRouter
  .route('/')
  .get(protect, admin, getOrders)
  .post(protect, addOrderItems);
orderRouter.route('/myorders').get(protect, getMyOrders);
orderRouter.route('/:id').get(protect, getOrderById);
orderRouter.route('/:id/pay').put(protect, updateOrderToPaid);
orderRouter.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

export default orderRouter;
