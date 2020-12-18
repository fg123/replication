// Serves the pages
const express = require('express');
const app = express();

//setting middleware
app.use('/', express.static(__dirname + '/dist'));
app.use('/resources', express.static(__dirname + '/resources'));
app.use('/data', express.static(__dirname + '/../data'));
const port = process.env.PORT || 8000;
const server = app.listen(port);
console.log('Server Started on', port);