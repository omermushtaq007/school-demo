require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next){
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({
      message: 'not authorized',
    });
  }
  try {
    const decode = jwt.verify(token , process.env.JWT_SECRET);
    req.user = decode.user;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({
      message: 'not authorized',
    });
  }
};
