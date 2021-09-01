const express = require('express');
const app = express();
const PORT = process.env.PORT || 8888;

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
  err ? process.exit(1) : console.log(`server running on port %d `, PORT);
});
