import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/user.js';

const protect = asyncHandler(async (req, res, next) => {
  let token;
  // Checks if we have authorization in the headers, and if it is a bearer authorization.
  // returning req.headers.authorization will be something like this:
  // 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwMWM3MmY2ZTNkYTJjMGJiN2JjNzI4OSIsImlhdCI6MTYxMjkyMzI1NywiZXhwIjoxNjE1NTE1MjU3fQ.BU9niTThdD-_Spk5nrG9IQkcwVgMYjnX6sBV3tROw6U'
  // req.headers.authorization.startsWith('Bearer') is the standard convention to see if auth is bearer.
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // we only want the token so we manipulate req.headers.authorization like this
      token = req.headers.authorization.split(' ')[1];
      // we will attempt to decode the token by using the jwt.verify() method. The first argument is
      // the token. We also have to pass in our secret which we defined in our .env file.
      // jwt.verify() will return the decoded token as an object with the user's id, issued at, and expiration
      // ex.) { id: '601c72f6e3da2c0bb7bc7289', iat: 1612923257, exp: 1615515257 }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // We can now fetch the user by using the decoded.id, but we will exclude the password from the
      // request body using the .select() method
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.log(error);
      res.status(401); // token has failed, not authorized
      throw new Error('Not Authorized, Token Failed');
    }
  }

  // Checks if there is no token. If none, we send a status code of 401 and throw a new error
  if (!token) {
    res.status(401); // not authorized
    throw new Error('Not Authorized, No Token');
  }
});

export { protect };
