const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      require: true,
    },
    lastName: {
      type: String,
      require: true,
    },
    username: {
      type: String,
      unique: true,
      require: true,
    },
    avatar: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      unique: true,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
  },
  { timestamps: true },
);

const user = mongoose.model('user', userSchema);
module.exports = user;
/**
 * username
 * email address
 * password
 * token
 * image
 * address
 * roles model
 * phone number
 * restLink
 * email activation
 */
