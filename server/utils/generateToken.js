import jwt from 'jsonwebtoken';

// We want to create a generateToken method with an id as our argument which we we will use as our
// payload. We use the jwt.sign() method which takes in a payload as the first argument.
// The payload will be an object with the id that we pass in. The second argument is the secret which
// we grab from our .env file. The third argument are options. We will set the token to expire in
// a certain amount of time. '30d' stands for 30 days
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export default generateToken;
