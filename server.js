const express = require('express');
const path = require('path');

const serverPortNum = 8000;
const htmlFile = path.join(__dirname + '/index.html');

// Create html server
var app = express();
app.use(express.static(__dirname));
app.get('/', function(req, res)
{
  res.sendFile(htmlFile);
});

app.listen(serverPortNum, function()
{
  console.log("Listening! (port " + serverPortNum + ")");
});