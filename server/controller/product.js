import asyncHandler from 'express-async-handler';
import Product from '../models/product.js';

// @desc  Fetch all products
// @route  GET /api/products
// @access  Public

const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// @desc  Fetch single product
// @route  GET /api/product/:id
// @access  Public

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404); // not found
    throw new Error('Product Not Found');
  }
});

// @desc  Fetch single product
// @route  GET /api/product/:id
// @access  Public

export { getProducts, getProductById };
