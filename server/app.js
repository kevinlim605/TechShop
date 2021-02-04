import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import products from './initial-data/products.js';
import dotenv from 'dotenv';
import colors from 'colors';
import connectDB from './config/db.js';

import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';

// .env file where we can define any API keys, secret tokens, etc.
dotenv.config();

// connecting our mongodb database with our node server using mongoose we configured
// in our config folder
connectDB();

// in node.js modules, __dirname and __filename don't exist, so we must
// use this architecture. (subject to change)
// https://stackoverflow.com/questions/8817423/why-is-dirname-not-defined-in-node-repl
const __dirname = path.resolve();

var app = express();

app.get('/', (req, res) => {
  res.send('API is running...');
  console.log('server is running on port 5000');
});

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find((p) => p._id === req.params.id);
  res.json(product);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
