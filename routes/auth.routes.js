const router = require('express').Router();
const {
  authLogin,
  authSignUp,
  authLogged,
  changePassword,
} = require('../controllers/auth.controller');

// input validators
const {
  firstName,
  lastName,
  email,
  password,
  currentPassword,
  username,
} = require('./validation');
// middleware
const { checkToken } = require('../auth.middleware');

/**
 * @access    public
 * @path      { /api/auth/signup }
 */
router.post(
  '/signup',
  [firstName, lastName, email, password, username],
  authSignUp,
);

/**
 * @access     public
 * @path       {/api/auth/login}
 */
router.post('/login', [email, password], authLogin);

/**
 * @access    private
 * @path      {/api/auth/me}
 */
router.get('/me', checkToken, authLogged);

/**
 *
 */
router.put('/change-password', checkToken, [password], changePassword);

module.exports = router;
