const express = require('express');
const app = express();
const https = require('https');
const ALPHA_API_KEY = process.env.ALPHA_API_KEY;
const username = process.env.API_USERNAME;
const password = process.env.API_PASSWORD;
const auth = "Basic " + new Buffer(username + ':' + password).toString('base64');
const sync = require('../controllers/sync');
const n1ql = require('../controllers/n1ql');

function updateStocks (data, date) {
	const update = {
		date: date.toDateString(),
		data: data
	}
	sync.syncStock(update)
}

const stocks = "AAPL,GOOGL,MSFT,AMZN,FB,BRK-A,BABA,JNJ,JPM,XOM,BAC,WMT,WFC,RDS-A,V,PG,BUD,T,CVX,UNH,PFE,CHL,HD,INTC,TSM,VZ,ORCL,C,NVS,SNAP,DIS,TSLA,NFLX,TWTR,RCII,RAD,SIRI,AIG,AXP,INT,INS,S,SBUX,X,XRX,PRU,PEP,PM,SNE,NTDOY"

// Intrinio API doesn't serve both security name and price in a single API call, so to get around that I 
// make two calls and modify the data before I send it to the client. 
// their API also takes 100 calls per every request I make, so I created an internal API with my database,
// that way I only make 100 calls per day max. 

app.get('/', (req, res, next) => {
	n1ql.findById('stock')
	.catch((err) => {
		throw err;
	})
  	.then((doc) => {
		const date = new Date(doc.date);
		const today = new Date();
		if (date.getDay() !== today.getDay()) {

			const request = https.request({
			    method: "GET",
			    host: "api.intrinio.com",
			    path: `/data_point?identifier=${stocks}&item=last_price`,
			    headers: {
			        "Authorization": auth
			    }
			}, (response) => {
			    let json = "";
			    response.on('data', function (chunk) {
			        json += chunk;
			    });
			    response.on('end', function() {
			        const companies = JSON.parse(json);

			        const request1 = https.request({
					    method: "GET",
					    host: "api.intrinio.com",
					    path: `/data_point?identifier=${stocks}&item=security_name`,
					    headers: {
					        "Authorization": auth
					    }
					}, (response1) => {
					    let json1 = "";
					    response1.on('data', function (chunk) {
					        json1 += chunk;
					    });
					    response1.on('end', function() {
					        const names = JSON.parse(json1);
		        			let count = 0;
					        for (let i = 0; i < companies.data.length; i++) {
					        	companies.data[i].name = names.data[i].value
					        	count++;
					        }
					        console.log(count)
					        if(count === companies.data.length) {
					        	updateStocks(companies, today);
					        	res.send(companies)					        	
					        }
					    });
					});
					request1.end();
			    });
			});
			request.end();
		} else {
			n1ql.findById('stock')
  			.then((doc, err) => {
				res.send(doc.data);
			})
		}
	})
})

module.exports = app;