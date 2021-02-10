import express from 'express';
import { getProducts, getProductById } from '../controller/product.js';

const productRouter = express.Router();

productRouter.get('/', getProducts);
productRouter.get('/:id', getProductById);

export default productRouter;
