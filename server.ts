//const express = require('express');
import * as path from "path";
import * as express from "express";

const serverPortNum = 8000;
const htmlFile = path.join(__dirname + '/index.html');

// Create html server
var app = express();
app.use(express.static(__dirname));
app.get('/', function(req: any, res: any)
{
  res.sendFile(htmlFile);
});

app.listen(serverPortNum, function()
{
  console.log("Listening! (port " + serverPortNum + ")");
});