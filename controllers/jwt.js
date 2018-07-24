const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

// defines the middleware for authenticating and signing JWT tokens

const authenticate = expressJwt({
    secret: 'secret',
    requestProperty: 'auth',
    getToken: function(req) {
	    if (req.headers['authorization']) {
	        return req.headers['authorization'];
	    }
	    return null;
	}
});

module.exports = {

	generateToken: function (req, res, next) {
	    req.token = jwt.sign({
		  exp: Math.floor(Date.now() / 1000) + (60 * 60),
		  data: {
		  	favorites: req.auth.favorites,
		  	id: req.auth.id,
		  	name: req.auth.name
		  }
		}, 'secret');
	    console.log("token: " + req.token)
		next();
	},

	sendToken: function (req, res) {
	    res.setHeader('x-auth-token', req.token);
	    res.status(200).send(req.auth);
	},

	authenticate: authenticate
}