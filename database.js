const mongoose = require('mongoose');
/**
 * @description     async function to connect database
 */
const connect = async () => {
  mongoose.connect(process.env.DATABASE_URL, (err) => {
    err ? console.error(err) : console.log('database connected...');
  });
};

module.exports = connect;