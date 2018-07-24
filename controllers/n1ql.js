const couchbase = require('couchbase');
const N1qlQuery = couchbase.N1qlQuery;
const bucket = require('../config/database');

module.exports = {
	findById: function (id) {
		return new Promise((resolve, reject) => {
			const query = N1qlQuery.fromString(`select * from \`default\` WHERE META(default).id = \'${id}\'`);
			console.log(query)
			bucket.query(query, (err, rows, meta) => {
				if(err) reject(err);
				console.log(rows)
				console.log(meta)
				if(rows.length === 0){
					resolve(false);
				} else {
					resolve(rows[0].default)
				}
				
			})
		})
	}
}
