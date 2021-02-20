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
// @route  GET /api/products/:id
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

// @desc  Delete a product
// @route  DELETE /api/products/:id
// @access  Private/Admin

const deleteProduct = asyncHandler(async (req, res) => {
  // find the product by id
  const product = await Product.findById(req.params.id);

  // check if the product exists. If so, we delete the product
  if (product) {
    await product.remove();
    res.json({ message: 'Product Removed' });
  } else {
    res.status(404); // not found
    throw new Error('Product Not Found');
  }
});

// @desc  Create a product
// @route  POST /api/products
// @access  Private/Admin

const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Sample Name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Sample brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
  });

  // We have to save to the database and store in const
  const createdProduct = await product.save();
  // created status code and send back created product in response object
  res.status(201).json(createdProduct);
});

// @desc  Update a product
// @route  PUT /api/products/:id
// @access  Private/Admin

const updateProduct = asyncHandler(async (req, res) => {
  // destructure consts from req.body object
  const {
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
  } = req.body;

  // find product by id from API Url call and store in const
  const product = await Product.findById(req.params.id);

  // if product exists, we'll update the properties with the values we got from
  // the req body
  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    // We have to save to the database as well as store in const
    const updatedProduct = await product.save();

    // We'll send back the updatedProduct in the res object
    res.json(updatedProduct);
  } else {
    res.status(404); // not found
    throw new Error('Product Not Found');
  }
});

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
};
