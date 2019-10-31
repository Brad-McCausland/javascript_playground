"use strict";
exports.__esModule = true;
//const express = require('express');
var path = require("path");
var express = require("express");
var serverPortNum = 8000;
var htmlFile = path.join(__dirname + '/index.html');
// Create html server
var app = express();
app.use(express.static(__dirname));
app.get('/', function (req, res) {
    res.sendFile(htmlFile);
});
app.listen(serverPortNum, function () {
    console.log("Listening! (port " + serverPortNum + ")");
});
