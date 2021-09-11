const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
require('dotenv').config();

/**
 * @description     input validations
 * @param           req firstName, lastName, email, username, password
 * @returns         errors
 */
exports.appValidations = [
  check('firstName')
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage('this is required fields'),
  check('lastName')
    .notEmpty()
    .isLength({ min: 2 })
    .withMessage('this is required fields'),
  check('username')
    .notEmpty()
    .isLength({ min: 2 })
    .withMessage('this is required field'),
  check('email')
    .isEmail()
    .withMessage('Invalid email address')
    .notEmpty()
    .withMessage('this is required field'),
  check('password')
    .isLength({ min: 8, max: 32 })
    .withMessage('must be at least 8 to 32 chars long')
    .matches(/^[A-Za-z0-9 .,'!&]+$/)
    .withMessage('must contain a number'),
];

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

exports.authLogin = (req, res) => {
  try {
    res.json({
      message: 'login auth works',
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'server internal error',
    });
  }
};
