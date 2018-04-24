const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');

// var jwt = require('jsonwebtoken');
const config = require('./app/config');
const routes = require('./app/routes/routes');
const port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/client/dist'));
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(function (req, res, next) {
    //set headers to allow cross origin request.
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

mongoose.connect(config.database);
app.set('superSecret', config.secret);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use(morgan('dev'));

app.use('/api', routes);

app.listen(port);
console.log('Magic happens at http://localhost:' + port);

