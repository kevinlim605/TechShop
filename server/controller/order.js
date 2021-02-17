import asyncHandler from 'express-async-handler';
import Order from '../models/order.js';

// @desc  Create new order
// @route  POST /api/orders
// @access  Private

const addOrderItems = asyncHandler(async (req, res) => {
  // destructure from the request body
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  // check if orderItems exist and if the orderItems array is empty
  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No Order Items');
  } else {
    // Instantiate a new order from the order model.
    const order = new Order({
      orderItems,
      // In addition, we want to add the user who is ordering. We can grab his id from
      // the token since this post request will be a protected route.
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    // We will save the order that we instantiated
    const createdOrder = await order.save();

    // success created status code, and return createdOrder in the response
    res.status(201).json(createdOrder);
  }
});

// @desc  Get order by ID
// @route  GET /api/orders/:id
// @access  Private

const getOrderById = asyncHandler(async (req, res) => {
  // find the order by the id in the url using .findById()
  // .populate() takes a first argument of what property in our Order document
  // we want to work with.
  // It also takes a second argument of a field name so that we return specific fields
  // In this example, we find an order object document in our mongoDB server that contains
  // the id of the id we use in the url of our api get call. That order document contains
  // a property called user which is a reference to a user document. By itself, it only
  // contains a reference to the user document shown by an object id. We populate that field
  // but only display the properties, name and email for the user document inside the
  // order document.
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  // if the order exists, we'll send the order back in the response
  if (order) {
    res.json(order);
  } else {
    res.status(404); // not found
    throw new Error('Error Not Found');
  }
});

export { addOrderItems, getOrderById };
