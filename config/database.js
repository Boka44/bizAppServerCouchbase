const couchbase = require('couchbase');
const USERNAME1 = process.env.USERNAME1;
const PASSWORD = process.env.PASSWORD;

const cluster = new couchbase.Cluster('couchbase://127.0.0.1');
// cluster.authenticate(USERNAME1, PASSWORD);
const bucket = cluster.openBucket('default');
// bucket.insert("Administrator", operationTimeout = 120 * 1000, ()=>{});

let couchbaseConnected = false;

bucket.on('error', function (err) {
    couchbaseConnected = false;
    console.log('CONNECT ERROR:', err);
});

bucket.on('connect', function () {
    couchbaseConnected = true;
    console.log('connected couchbase');
});
module.exports = bucket;

