const request = require('request');
const n1ql = require('./n1ql');
const user = require('../models/user');
const username = process.env.USERNAME2;
const password = process.env.PASSWORD;
const auth = new Buffer(username + ':' + password).toString('base64');

const options = {
	uri: '',
	method: 'put',
	headers: {
		Authorization: 'Basic ' + auth,
		'Content-Type': 'application/json'
	},
	json: true
}

module.exports = {
	syncAddUser: function (id, data) {
		options.uri = `http://localhost:4984/db/${id}?new_edits=true`;
		options['body'] = data;

		console.log(options)
		request(options, (err, response, body) => {
			if(err) throw err;
		})
	},

	syncUser: function (id, fav) {
		n1ql.findById(id)
		.then((result) => {
			return new Promise((resolve, reject) => {
				let data = new user.user(result.user, result.id, result.token, fav);
				data['_rev'] = result._sync.rev;				
				options.uri = `http://localhost:4984/db/${id}?new_edits=true`;
				options['body'] = data;
				request.put(options, (err, response, body) => {
					if(err) reject(err);
					resolve(data, err)
				})
			})
		})
	},

	syncStock: function (data) {
		n1ql.findById('stock')
		.then((result) => {
			return new Promise((resolve, reject) => {
				data['_rev'] = result._sync.rev;
				options.uri = `http://localhost:4984/db/stock?new_edits=true`;
				options['body'] = data;
				request.put(options, (err, response, body) => {
					if(err) reject(err);
					resolve(data)
				})
			})
		})
	}
}