import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Each Schema can define instances and static methods for its model.
// To define a method, we simply use Schema.method.namedmethod. See example below.
// Here, we we define a async function which will take a plain text
// password argument, "enteredPassword", as it's argument.
// Then in the body, we will use bcrypt's compare method to compare that argument plain
// text password with the encrypted hashed password, "this.password" in the user database.
// It will return a promise so we use await.
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
