const { check } = require('express-validator');

exports.firstName = [
  check('firstName')
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage('this is required fields'),
];
exports.lastName = [
  check('lastName')
    .notEmpty()
    .isLength({ min: 2 })
    .withMessage('this is required fields'),
];
exports.username = [
  check('username')
    .notEmpty()
    .isLength({ min: 2 })
    .withMessage('this is required field'),
];
exports.email = [
  check('email')
    .isEmail()
    .withMessage('Invalid email address')
    .notEmpty()
    .withMessage('this is required field'),
];

exports.password = [
  check('password')
    .isLength({ min: 8, max: 32 })
    .withMessage('must be at least 8 to 32 chars long')
    .matches(/^[A-Za-z0-9 .,'!&]+$/)
    .withMessage('must contain a number'),
];
