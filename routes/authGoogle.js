const express = require('express');
const passport = require('passport');
const app = express();
const jwt = require('../controllers/jwt');

// authentication for google login. Uses JWT middleware.

app.post('/', passport.authenticate('google-id-token', {session: false}), (req, res, next) => {

	if (!req.user) {
      return res.send(401, 'User Not Authenticated');
    }

    console.log("User var: " + req.user);

    req.auth = {
      id: req.user.id,
      favorites: req.user.favorites,
      name: req.user.name,
      token: req.user.token
	};	

    next();
}, jwt.generateToken, jwt.sendToken);

module.exports = app;
