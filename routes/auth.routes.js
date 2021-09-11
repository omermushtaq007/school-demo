const router = require('express').Router();
const {
  authLogin,
  authSignUp,
  appValidations,
} = require('../controllers/auth.controller');


router.post('/signup', appValidations, authSignUp);
router.get('/login', authLogin);

module.exports = router;
