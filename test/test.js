const chai = require('chai');
const chaiHttp = require('chai-http');
const request = require('request')
const assert = chai.assert;
const should = chai.should();

chai.use(chaiHttp);

describe('GET', function() {
	it('should return the correct data JSON and todays date', function() {
	chai.request('http://localhost:3000')
		.get('/finance')
		.end(function(err, res) {
			res.body.should.be.json;
			res.body.should.be.a('object');
			res.body.should.have.property('data');
			res.body.date.should.equal(new Date());
		})
	}) 
});