const express = require('express');
const passport = require('passport');
const app = express();
const jwt = require('../controllers/jwt');
const sync = require('../controllers/sync');

// This path is used to update the users favorites

app.post('/', jwt.authenticate, (req, res, next) => {
	console.log(req.body.favorites)
	sync.syncUser(req.auth.data.id, req.body.favorites)
	.then((user, err) => {
		console.log("Updated: " + user)
	})
})

module.exports = app;