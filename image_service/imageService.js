const imagePortNum = 9001;

const fs = require('fs');
const express = require('express');
const path = require('path');

const imageDirectory = fs.readdirSync("images/");
let images = [];
imageDirectory.forEach (function(fileName)
{
  let file = "images/" + fileName;
  encodedImage = Buffer(fs.readFileSync(file)).toString('base64');
  images.push(encodedImage);
});

let imageData = JSON.stringify(images);

// Create image-serving server
var app = express();
app.use(express.static(__dirname));
app.get('/', function(req, res)
{
  console.log("Serving images");
  res.send(imageData);
});

app.listen(imagePortNum, function()
{
  console.log("Images being served on port " + imagePortNum);
});