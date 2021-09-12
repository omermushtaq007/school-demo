const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
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

    await user.save();

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
      return res.json({
        message: 'invalid credentials',
      });
    }

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.json({
        message: 'invalid credentials',
      });
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
    return res.status(500).json({
      message: 'server internal error',
    });
  }
};
