const router = require('express').Router();
const { authLogin, authSignUp } = require('../controllers/auth.controller');
const {
  firstName,
  lastName,
  email,
  password,
  username,
} = require('../controllers/validation');

router.post(
  '/signup', // path
  [firstName, lastName, email, password, username], // validation
  authSignUp, // controller
);

router.post(
  '/login', // path
  [email, password], // validators
  authLogin, // controller
);

module.exports = router;
