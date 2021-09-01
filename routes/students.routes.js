const router = require('express').Router();
const {students} = require('../controllers/students.controller');
// router.get('/', (req, res) => res.json({ message: 'student works' }));
router.get('/', students);

module.exports = router;
