const express = require('express');
const passport = require('passport');
const app = express();
const jwt = require('../controllers/jwt');
const n1ql = require('../controllers/n1ql');

// Get the user and send the user data back to the client

app.get('/', jwt.authenticate, (req, res, next) => {

	n1ql.findById(req.auth.data.id)
  	.then((user, err) => {
		res.send(user)
	})
	
})

module.exports = app;