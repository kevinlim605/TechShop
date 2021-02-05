import express from 'express';
import asyncHandler from 'express-async-handler';
import Product from '../models/product.js';

const productRouter = express.Router();

// @desc  Fetch all products
// @route  Get /api/products
// @access  Public
productRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.json(products);
  })
);

// @desc  Fetch single product
// @route  Get /api/product/:id
// @access  Public
productRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error('Product Not Found');
    }
  })
);

export default productRouter;
