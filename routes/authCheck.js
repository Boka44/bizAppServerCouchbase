const express = require('express');
const passport = require('passport');
const app = express();
const jwt = require('../controllers/jwt');
const n1ql = require('../controllers/n1ql');

// checks to make sure the current user is still logged in by using JWT middleware
// resets JWT expiration date so user can stay logged into a session if need be.

const getCurrentUser = function(req, res, next) {
	console.log(req.auth)

  n1ql.findById(req.auth.data.id)
  .then((user, err) => {
    if (err) {
      next(err);
    } else {
      req.user = user;
      console.log(user)
      next();
    }
  });
};

const getOne = function (req, res) {
  const user = req.user
  console.log("User: " + user)
  delete user['__v'];

  res.json(user);
};

app.get('/', jwt.authenticate, getCurrentUser, getOne);

app.get('/test', (req, res) => {
	
	console.log(req.headers);
})
module.exports = app;