import asyncHandler from 'express-async-handler';
import User from '../models/user.js';

// @desc  Auth user & get token
// @route  POST /api/users/login
// @access  Public

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // We use the .findOne() method on our User model to find one document that matches the argument.
  // We write { email: email } in the argument to find a document with the same email, but we can write
  // shorthand { email } because the key and value are the same.
  const user = await User.findOne({ email });

  // We need to check if the user exists and the password matches. We instantiate the method in the User
  // model. That method will return a promise so we use await (subject to change video lecture)
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: null,
    });
  } else {
    res.status(401); // not authorized
    throw new Error('Invalid Email or Password');
  }
});

export { authUser };
