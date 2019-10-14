const fs = require('fs');
const express = require('express');
const cors = require('cors');

const imagePortNum = 8001;
const allImageDirectories = ["album_images", "other_images"]

var images = {};
var imageCount = 0;

// Load all files in all image directories. Keyed by directory name then file name.
allImageDirectories.forEach (function (dirName)
{
  let currentDirectoryImages = {};
  const currentDirectory = fs.readdirSync(dirName);
  currentDirectory.forEach (function(fileName)
  {
    let file = dirName + "/" + fileName;
    encodedImage = Buffer(fs.readFileSync(file)).toString('base64');
    currentDirectoryImages[fileName] = encodedImage;
    imageCount++;
  });
  images[dirName] = currentDirectoryImages;
});

// Convert array to JSON
let imageData = JSON.stringify(images);

// Create image-serving server
var app = express();
app.use(express.static(__dirname));
app.use(cors());
app.get('/', function(req, res)
{
  console.log("Serving " + imageCount + " images");
  res.send(imageData);
});

app.listen(imagePortNum, function()
{
  console.log("Images being served on port " + imagePortNum);
});