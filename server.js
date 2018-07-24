const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require('passport');
const session = require("express-session");
const cors = require('cors');
const PORT = process.env.PORT || 3000;
const app = express();

require('./config/database');
require('./config/passport')(passport);
const authFacebook = require('./routes/authFacebook');
const authGoogle = require('./routes/authGoogle');
const authCheck = require('./routes/authCheck');
const finance = require('./routes/finance');
const update = require('./routes/update');
const getUser = require('./routes/getUser');


app.use(bodyParser.json());

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({ 
	secret: "itsASecretToEveryone",
	resave: false,
	saveUninitialized: false
 }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res, next) => {
	res.send('Yo')
})

const corsOption = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token']
};
app.use(cors(corsOption));

app.use('/authFacebook', authFacebook);
app.use('/authCheck', authCheck);
app.use('/authGoogle', authGoogle);
app.use('/finance', finance);
app.use('/update', update);
app.use('/getUser', getUser);

app.listen(PORT, () => {
	console.log("server is running on port " + PORT);
})