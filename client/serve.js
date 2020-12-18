// Serves the pages
const express = require('express');
const app = express();

//setting middleware
app.use('/', express.static(__dirname + '/dist'));
app.use('/resources', express.static(__dirname + '/resources'));
const server = app.listen(process.env.PORT || 8000);