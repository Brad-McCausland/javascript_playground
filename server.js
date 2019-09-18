const portNum = 8000;

const fs = require('fs');
const express = require('express');
const path = require('path');

const htmlFile = path.join(__dirname + '/index.html');

var app = express();
app.use(express.static(__dirname));
app.get('/', function(req, res) {
    res.sendFile(htmlFile);
});

app.listen(portNum);
console.log("Listening! (port " + portNum + ")");