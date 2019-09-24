const fs = require('fs');
const express = require('express');
const cors = require('cors');

const imagePortNum = 8001;
const imageDirectory = fs.readdirSync("images/");

// Load each file in images directory, convert them to Base64, and push the base64 data onto images[]
var images = [];
imageDirectory.forEach (function(fileName)
{
  let file = "images/" + fileName;
  encodedImage = Buffer(fs.readFileSync(file)).toString('base64');
  images.push(encodedImage);
});

// Convert array to JSON
let imageData = JSON.stringify(images);

// Create image-serving server
var app = express();
app.use(express.static(__dirname));
app.use(cors());
app.get('/', function(req, res)
{
  console.log("Serving " + images.count + " images");
  res.send(imageData);
});

app.listen(imagePortNum, function()
{
  console.log("Images being served on port " + imagePortNum);
});