const express = require('express');
const routes = express.Router();

const userRoutes = require('./user.routes');


routes.use('/users', userRoutes);


routes.get('/', function (req, res) {
    res.json({ message: 'Welcome to the coolest API on earth!' });
});

module.exports = routes;