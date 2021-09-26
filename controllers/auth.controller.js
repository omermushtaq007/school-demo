require('dotenv').config();
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const mailgun = require('mailgun-js');
const Domain = process.env.MAIL_GUN_DOMAIN;
const mg = mailgun({ apiKey: process.env.MAIL_GUN_API, domain: Domain });

/**
 * @description   entered value returns hash encryption value
 * */
const encryptPassword = async (password) => {
  let salt = await bcrypt.genSalt();
  return await bcrypt.hash(password, salt);
};

/**
 * @description  User Register Api
 * @param        req firstName, lastName, email, username, password
 * @param        res x-auth-token
 */
exports.authSignUp = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.json(errors).status(400);
  }
  try {
    const { firstName, lastName, email, username, password } = req.body;

    let user = await User.findOne({ email: email, username: username });

    if (user) {
      res
        .json({
          message: 'this user already exists, try another email',
        })
        .status(409);
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

    user.password = await encryptPassword(password);

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
        res.json({ token }).status(200);
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
 * @description  User Login Api
 * @param        req email, password
 * @param        res x-auth-token
 */
exports.authLogin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.json(errors).status(400);
  }

  const { email, password } = req.body;

  try {
    // Check user's email existence
    // If email return user credentials
    // else return invalid credentials
    let user = await User.findOne({
      email: email,
    });

    if (!user) {
      res
        .json({
          message: 'invalid credentials',
        })
        .status(400);
    }

    // checking entered password
    // if password incorrect return invalid credentials
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      res
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
        res
          .json({
            token,
          })
          .status(200);
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
      console.log('user logged: ' + req.user.id);
      res.json({user}).status(200);
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
    res.json(errors).status(400);
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

    let newPassword = (user.password = await encryptPassword(password));

    let changePassword = await User.updateOne({
      id: user.id,
      password: newPassword,
    });

    if (!changePassword) {
      console.error(err.message);
      res
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
    res.json(errors).status(400);
  }
  const { email } = req.body;
  try {
    let user = await User.findOne({ email: email });
    if (!user || user === null) {
      res.json({ message: 'invalid email' }).status(400);
    }

    const restLink = jwt.sign(
      { id: user.id },
      process.env.PASSWORD_FORGOT_SECRET,
      { expiresIn: '2m' },
    );

    const data = {
      from: 'noreply@school.com',
      to: email,
      subject: 'Hello',
      html: `<h1>hello world!</h1>
             <p>${restLink}</p>`,
    };

    let resetPasswordRequest = await User.updateOne(
      { _id: user.id },
      { $set: { restLink: restLink } },
    );
    if (!resetPasswordRequest) {
      console.error('invalid request');
      res
        .json({
          message: 'invalid request',
        })
        .status(400);
    }
    await mg.messages().send(data, (err, body) => {
      if (err) {
        res.json(err).status(401);
      }
      res.json({ message: 'sent!' }).status(200);
    });
  } catch (err) {
    console.error(err);
    return res
      .json({
        message: 'server internal error',
      })
      .status(500);
  }
};
