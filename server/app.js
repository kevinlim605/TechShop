import createError from 'http-errors';
import express from 'express';
// path module provides a lot of very useful functionality to access and interact
// with the file system.
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import dotenv from 'dotenv';
import colors from 'colors';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// my routes
import indexRouter from './routes/index.js';
import userRouter from './routes/user.js';
import productRouter from './routes/product.js';
import orderRouter from './routes/order.js';
import uploadRouter from './routes/upload.js';

// .env file where we can define any API keys, secret tokens, etc.
dotenv.config();

// connecting our mongodb database with our node server using mongoose we configured
// in our config folder
connectDB();

// in node.js modules, __dirname and __filename don't exist, so we must
// use this architecture.
const __dirname = path.resolve();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// morgan
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// my routes
app.use('/', indexRouter);
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
app.use('/api/upload', uploadRouter);

// PayPal route
app.get('/api/config/paypal', (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);

// uploads folder will not be accessible by the browser by default. We can make it
// static by using express.static(root) so that it can be loaded in the browser.
// The root argument specifies the root directory from which to serve static assets,
// which in our case will be the uploads folder
// path.join() joins two or more parts of a path, similar to String.concatenate()
// ex.) path.join('/', 'users', 'joe', 'notes.txt') === '/users/joe/notes.txt'
// __dirname is an environment variable that tells you the absolute path
// of the directory containing the currently executing file
// ex.) __dirname === '/Users/Kevin/ProjectFolder/TechShop/server'
// Essentially, we are performing this:
// express.static('/Users/Kevin/ProjectFolder/TechShop/server/uploads')
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// my own catch 404 error handler middleware
app.use(notFound);

// my own error handler middleware
app.use(errorHandler);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
