require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connect = require('./database');
const app = express();
const PORT = process.env.PORT || 8888;

connect(); // database

/**
 * @description   list of white IP address
 */
const whiteList = [
  process.env.NODE_ENV === true
    ? console.log('production')
    : `http://localhost:${PORT}/`,
  'http://localhost:4200',
];

/**
 * @description   enable cors middleware
 */
const corsOption = {
  origin: (origin, callback) => {
    console.log('***Request Origin ' + origin);
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      console.log('Origin Request Granted!');
      callback(null, true);
    } else {
      console.log('Invalid Origin Request!');
      callback(new Error('Invalid Error'));
    }
  },
};
app.use(cors(corsOption));
app.use(express());
app.use(express.json({ extended: false }));

//routes
app.use('/api/students', require('./routes/students.routes'));
app.use('/api/auth', require('./routes/auth.routes'));

/**
 * @method          GET
 * @access          public
 * @returns         404 Bad Request
 * @description     Response for invalid request
 */
app.get('*', (req, res) => res.json({ message: 'invalid api' }).status(400));

app.listen(PORT, (err) => {
  err ? process.exit(1) : console.log(`server start at port: %d`, PORT);
});
