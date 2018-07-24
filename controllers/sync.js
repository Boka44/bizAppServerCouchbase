const request = require('request');
const n1ql = require('./n1ql');
const user = require('../models/user');

module.exports = {
	syncAddUser: function (id, data) {
		request.put(`http://localhost:4985/db/${id}?new_edits=true`, {json: data}, (err, response, body) => {
			if(err) throw err;
		})
	},

	syncUser: function (id, fav) {
		n1ql.findById(id)
		.then((result) => {
			return new Promise((resolve, reject) => {
				let data = new user.user(result.user, result.id, result.token, fav);
				data['_rev'] = result._sync.rev;
				request.put(`http://localhost:4985/db/${id}?new_edits=true`, {json: data}, (err, response, body) => {
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
				request.put(`http://localhost:4985/db/stock?new_edits=true`, {json: data}, (err, response, body) => {
					if(err) reject(err);
					resolve(data)
				})
			})
		})
	}
}