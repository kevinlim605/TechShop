import asyncHandler from 'express-async-handler';
import Product from '../models/product.js';

// @desc  Fetch all products
// @route  GET /api/products
// @access  Public

const getProducts = asyncHandler(async (req, res) => {
  // Paginate functionality requires a static number called pageSize which
  // refers to how many products we want to show on one page.
  const pageSize = 10;
  // page refers to whatever the page is in the query
  // ex.) /api/products?pageNumber=3 so the query is 3
  // we'll grab the query, convert it to a number and set it as page
  // OR we'll set it to 1 if it isn't defined in the query
  const page = Number(req.query.pageNumber) || 1;

  // req.query.keyword is how you can get query strings. ex.)
  // if we make a get request to /api/products?phone, then req.query.keyword
  // will return phone
  const keyword = req.query.keyword
    ? {
        name: {
          // $regex is a mongoose evaluation query operator that provides regular
          // expression capabilities for pattern matching strings in queries.
          // If our keyword was something like 'iph' it could match with iphone
          $regex: req.query.keyword,
          // $options is a mongoose evaluation query operator that can evaluate
          // different ways depending on the options. 'i' for example, is for
          // Case insensitivity to match upper and lower cases
          $options: 'i',
        },
        // else if no keyword exists or is an empty string, then we'll return an
        // empty object. That way, we know are getProducts handler will just return
        // all of the product documents when we await Product.find() down below
      }
    : {};

  // we'll set the total count of products by searching through our Product model
  // and use a mongoose countDocuments method to actually count the number of products.
  // it takes an argument of a keyword, which we'll pass in our keyword if we have one.
  // if keyword is set to empty object, it will just count all the documents
  const count = await Product.countDocuments(keyword);
  // We'll also add a limit to the number of product documents we want returned. We can
  // do this by using the mongoose .limit() method on our Product model. We'll limit
  // the number of product documents returned to the pageSize.
  // ex.) If we only want 10 documents returned on a single page, then we do .limit(10)
  // to return only 10 product documents.
  // However, if we're on different page than page 1, then we want the next 10 documents
  // returned. ex.) we don't want documents 1-10, we want documents 11-20 from our database
  // Therefore, we can find that number using the pageSize multiplied by the page minus 1
  // and the use mongoose .skip method on our product model to skip a number of documents
  const products = await Product.find(keyword)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  // We will also return the page and the pages. We can define pages by using
  // the math method, .ceil() to round up the count (number of documents returned) divided
  // by the pageSize. Ex.) if we had 45 documents returned in count and a pageSize of 10,
  // then we obviously have 5 pages worth of products to show.
  res.json({ products, page, pages: Math.ceil(count / pageSize) });
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

// @desc  Create new review
// @route  POST /api/products/:id/reviews
// @access  Private

const createProductReview = asyncHandler(async (req, res) => {
  // destructure consts from req.body object
  const { rating, comment } = req.body;

  // find product by id from API Url call and store in const
  const product = await Product.findById(req.params.id);

  // if product exists, we'll update the properties with the values we got from
  // the req body
  if (product) {
    // check if the user already reviewed this particular product. Use the array method,
    // .find(), on product.reviews and check if each review, 'r', has a user property,
    // that matches with the user id from the request body
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    // if alreadyReviewed === true, then we'll throw a new error
    if (alreadyReviewed) {
      res.status(400); // Bad Request
      throw new Error('Product Already Reviewed');
    }

    const review = {
      name: req.user.name,
      // we could use shorthand but we want to convert the string to a number
      rating: Number(rating),
      // comment can be shorthand because we want it to be a string
      comment,
      user: req.user._id,
    };

    // We want to push the new review into the reviews array property of products document
    product.reviews.push(review);

    // We have a new number of reviews so we have to update that property as well
    product.numReviews = product.reviews.length;

    // We need to update the product's rating which we can do by calculating the average
    // ratings of all the reviews
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    // We need to save the updated product document
    await product.save();

    // new resource created and send back message
    res.status(201).json({ message: 'Review Added' });
  } else {
    res.status(404); // not found
    throw new Error('Product Not Found');
  }
});
// @desc  Get top rated products
// @route  GET /api/products/top
// @access  Public

const getTopProducts = asyncHandler(async (req, res) => {
  // We can sort our product documents using mongoose .sort() method.
  // It takes one parameter, an object defining the sorting order.
  // 1 is ascending order, -1 is descending order, so our products will
  // be listed in descending order. We will also limit only the first 3 products returned
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);
  res.json(products);
});

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
};
