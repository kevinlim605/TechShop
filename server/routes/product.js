import express from 'express';
import {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
} from '../controller/product.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const productRouter = express.Router();

productRouter.route('/').get(getProducts).post(protect, admin, createProduct);
productRouter
  .route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

export default productRouter;
