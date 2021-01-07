// Serves the pages
const express = require('express');
const Constants = require('./constants');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

//setting middleware
app.use('/', express.static(__dirname + '/dist'));
app.use('/resources', express.static(__dirname + '/resources'));
app.use('/data', express.static(__dirname + '/../data'));

if (!Constants.isProduction) {
    app.use('/tools', express.static(__dirname + '/../devtools'));
    app.get('/data/maps', (req, res) => {
        res.send(fs.readdirSync(__dirname + '/../data/maps'));
    });
    app.post('/data/maps/save', (req, res) => {
        console.log("Writing file: " + req.body.file);
        fs.writeFileSync(__dirname + '/../data/maps/' + req.body.file,
            JSON.stringify(req.body.data, null, 1));
        res.send('ok');
    })
}

const port = process.env.PORT || 8000;
const server = app.listen(port);
console.log('Server Started on', port);