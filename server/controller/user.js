import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
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
      // We will generate a token from our generateToken method we imported from utils/generateToken.js
      token: generateToken(user._id),
    });
  } else {
    res.status(401); // not authorized
    throw new Error('Invalid Email or Password');
  }
});

// @desc  Register a new user
// @route  POST /api/users
// @access  Public

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status('400'); // Bad Request
    throw new Error('User already exists');
  }

  // shorthand
  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    // created
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400); // not found
    throw new Error('Invalid user data');
  }
});

// @desc  Get user profile
// @route  GET /api/users/profile
// @access  Private

const getUserProfile = asyncHandler(async (req, res) => {
  // We are finding the user by their id, which is whoever the current logged in user is.
  const user = await User.findById(req.user._id);
  // check for the user
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404); // not found
    throw new Error('User Not Found');
  }
});

// @desc  Update user profile
// @route  PUT /api/users/profile
// @access  Private

const updateUserProfile = asyncHandler(async (req, res) => {
  // We are finding the user by their id, which is whoever the current logged in user is.
  const user = await User.findById(req.user._id);
  // check for the user
  // if the user checks out, we will update the user info with the req.body info
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }

    // We have to save the updated info
    const updatedUser = await user.save();
    // Then we send the updated info back in json format for our frontend
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404); // not found
    throw new Error('User Not Found');
  }
});

export { authUser, registerUser, getUserProfile, updateUserProfile };
