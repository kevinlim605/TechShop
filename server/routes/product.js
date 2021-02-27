import express from 'express';
import {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
} from '../controller/product.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const productRouter = express.Router();

productRouter.route('/').get(getProducts).post(protect, admin, createProduct);
productRouter.route('/:id/reviews').post(protect, createProductReview);
productRouter.route('/top').get(getTopProducts);
productRouter
  .route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

export default productRouter;
