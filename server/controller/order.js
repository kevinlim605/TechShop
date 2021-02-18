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

// @desc  Update order to paid
// @route  PUT /api/orders/:id/pay
// @access  Private

const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    // We'll set the isPaid property to true
    order.isPaid = true;
    // We'll set the paidAt property to the current date
    order.paidAt = Date.now();
    // We'll set the paymentResult property to an object, The object property values
    // will come from the PayPal req body
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    // We have to save the updated order in the database
    const updatedOrder = await order.save();

    // We'll return the updated order in our response object
    res.json(updatedOrder);
  } else {
    res.status(404); // not found
    throw new Error('Order Not Found');
  }
});

// @desc  Get logged in user orders
// @route  GET /api/orders/myorders
// @access  Private

const getMyOrders = asyncHandler(async (req, res) => {
  // only find orders where the user is equal to the user id in the request body
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

export { addOrderItems, getOrderById, updateOrderToPaid, getMyOrders };
