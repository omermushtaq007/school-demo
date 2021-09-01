const router = require('express').Router();
const { authLogin, authSignUp } = require('../controllers/auth.controller');
// router.get('/', (req, res) => res.json({ message: 'student works' }));
router.post('/signup', authSignUp);
router.get('/login', authLogin);

module.exports = router;
