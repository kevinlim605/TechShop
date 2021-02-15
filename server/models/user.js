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

// We can add middleware to a Schema pre-save by using Schema.pre('save'). We do not have to
// add it to our user Controller. Mongoose will run in pre-save
userSchema.pre('save', async function (next) {
  // We only want to salt and hash the password if the password is sent (POST to create new user),
  // or if it's modified (change password through update profile functionality). If we updated
  // our profile to only change the email and not the password, then we DO NOT want this
  // to run because it will create a new hash. Therefore we will use  mongoose's .isModified()
  // method to check if the password was modified. If it wasn't sent/modified, then we want to
  // call next() and move on. If it hasn't been sent/modified, then we want to continue and
  // hash the password
  if (!this.isModified('password')) {
    next();
  }
  // salt is random data that is used as an additional input to a one-way function that
  // hashes a password. We can use bcrypt.genSalt() method to generate a salt. It takes an
  // argument of rounds and it returns a promise so we use await
  const salt = await bcrypt.genSalt(10);
  // we'll hash the user's password using bcrypt.hash method. It takes the plaintext password
  // as it's first argument and the salt as the second argument
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;
