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
    roles: {
      isAdmin: {
        type: Boolean,
        default: false,
      },
      isTeacher: {
        type: Boolean,
        default: false,
      },
      isStudent: {
        type: Boolean,
        default: false,
      },
      isVisitor: {
        type: Boolean,
        default: true,
      },
    },
    restLink: {
      data: String,
    },
  },
  { timestamps: true },
);

const User = mongoose.model('user', userSchema);

module.exports = User;
