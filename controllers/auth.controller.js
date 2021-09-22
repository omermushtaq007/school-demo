const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const mailgun = require("mailgun-js");
require('dotenv').config();
/**
 * @description  User Register Api
 * @param        req firstName, lastName, email, username, password
 * @param        res x-auth-token
 */
exports.authSignUp = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json(errors);
  }
  try {
    const { firstName, lastName, email, username, password } = req.body;

    let user = await User.findOne({ email: email, username: username });

    if (user) {
      return res.status(409).json({
        message: 'this user already exists, try another email',
      });
    }

    let avatar = gravatar.url(email, {
      s: '200',
      d: 'mm',
      r: 'pg',
    });

    user = new User({
      firstName,
      lastName,
      email,
      avatar,
      username,
      password,
    });

    let salt = await bcrypt.genSalt();

    user.password = await bcrypt.hash(password, salt);

    console.log('user created!');
    await user.save(); // user create
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      },
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'server internal error',
    });
  }
};

/**
 * @description  User Login Api
 * @param        req email, password
 * @param        res x-auth-token
 */
exports.authLogin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json(errors);
  }

  const { email, password } = req.body;

  try {
    let user = await User.findOne({
      email: email,
    });

    if (!user) {
      return res
        .json({
          message: 'invalid credentials',
        })
        .status(400);
    }

    // matching password
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res
        .json({
          message: 'invalid credentials',
        })
        .status(400);
    }
    const payload = {
      user: {
        id: user.id,
      },
    };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        return res.status(200).json({
          token,
        });
      },
    );
  } catch (err) {
    console.error(err);
    return res
      .json({
        message: 'server internal error',
      })
      .status(500);
  }
};

/**
 * @param {*} req
 * @param {*} res
 * @returns user credentials
 */
exports.authLogged = async (req, res) => {
  try {
    let user = await User.findById(req.user.id).select(['-_id', '-password']);
    if (user) {
      console.log(req.user.id + ' user logged');
      return res.json(user).status(200);
    }
  } catch (err) {
    console.error(err);
    return res
      .json({
        message: 'server internal error',
      })
      .status(500);
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns change password
 */
exports.changePassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json(errors);
  }
  const { password, currentPassword } = req.body;
  try {
    let user = await User.findById(req.user.id).select(['-roles']);
    if (!user || user == null) {
      return res
        .json({
          message: 'user not found!',
        })
        .status(400);
    }

    let isMatched = await bcrypt.compare(currentPassword, user.password);
    if (!isMatched) {
      return res
        .json({
          message: "password doesn't matched",
        })
        .status(400);
    }

    let salt = await bcrypt.genSalt();

    let newPassword = (user.password = await bcrypt.hash(password, salt));

    let changePassword = await User.updateOne({
      id: user.id,
      password: newPassword,
    });

    if (!changePassword) {
      console.error(err.message);
      return res
        .json({
          message: 'update unsuccessful',
        })
        .status(400);
    }
    await user.save();
    return res
      .json({
        message: 'password change successfully',
      })
      .status(200);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'server internal error',
    });
  }
};

exports.forgotPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json(errors);
  }
  const { email } = req.body;
  try {
    let user = await User.findOne({ email: email });
    if (!user || user == null) {
      return res.json({ message: 'invalid email' }).status(400);
    }
    
  } catch (err) {
    console.error(err);
    return res
      .json({
        message: 'server internal error',
      })
      .status(500);
  }
};
