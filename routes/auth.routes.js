const router = require('express').Router();
const authMiddleware = require('../auth.middleware');
const {
  authLogin,
  authSignUp,
  authLogged,
} = require('../controllers/auth.controller');
const {
  firstName,
  lastName,
  email,
  password,
  username,
} = require('../controllers/validation');

/**
 * @access    public
 * @path      { /api/auth/signup }
 */
router.post(
  '/signup', // path
  [firstName, lastName, email, password, username], // validation
  authSignUp, // controller
);

/**
 * @access     public
 * @path       {/api/auth/login}
 */
router.post(
  '/login', // path
  [email, password], // validators
  authLogin, // controller
);

router.get('/me', authMiddleware, authLogged);
module.exports = router;
