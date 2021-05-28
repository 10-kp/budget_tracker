//Dependencies
const express = require('express');

//Middleware (logs all request details)
const logger = require('morgan');
const mongoose = require('mongoose');
const compression = require('compression');

//Heroku and local
const PORT = process.env.PORT || 3000;

//Express function
const app = express();

app.use(logger('dev'));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/budget', {
  useNewUrlParser: true,
  useFindAndModify: false,
});

// routes
app.use(require('./routes/api.js'));

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
