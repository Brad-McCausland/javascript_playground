const serverPortNum = 8000;

const fs = require('fs');
const express = require('express');
const path = require('path');

const htmlFile = path.join(__dirname + '/index.html');

// Create html server
var app = express();
app.use(express.static(__dirname));
app.get('/', function(req, res)
{
  console.log(req);
  res.sendFile(htmlFile);
});

app.listen(serverPortNum, function()
{
  console.log("Listening! (port " + serverPortNum + ")");
});