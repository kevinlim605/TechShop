import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import users from './initial-data/users.js';
import products from './initial-data/products.js';
import User from './models/user.js';
import Product from './models/product.js';
import Order from './models/order.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    const createdUser = await User.insertMany(users);
    const adminUser = createdUser[0]._id;
    const sampleProducts = products.map((product) => {
      return {
        ...product,
        user: adminUser,
      };
    });
    await Product.insertMany(sampleProducts);
    console.log('Data Imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.log(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.log(`${error}`.red.inverse);
    process.exit(1);
  }
};

// we can create a script for running importData() or destroyData()
// when we run the script for this file, seeder.js, we run node seeder
// we'll make it so that when we run node seeder, we'll check for the value
// of the flag used. We can grab that value using process.argv[] which is an array
// and we can get the value of the flag which is the 2nd index of the process.argv[].
// depending on what flag value we use or if we even use one, the script we'll write
// in package.json will run either destroyData() or importData()
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
