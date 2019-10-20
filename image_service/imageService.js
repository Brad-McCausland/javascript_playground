const fs = require('fs');
const express = require('express');
const cors = require('cors');

const PORT_NUMBER = 8001;
const ALL_IMAGE_DIRECTORIES = ["album_images", "other_images"]

// Optional cmd line arguments for simulating network interruptions
const DELAY_DELIVERY = process.argv[2] == "delay" ? true : false;
const DO_NOT_DELIVER = process.argv[2] == "dnd"   ? true : false;

var images = {};
var imageCount = 0;

// Load all files in all image directories. Keyed by directory name then file name.
ALL_IMAGE_DIRECTORIES.forEach (function (dirName)
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
    // If debug, delay for a random amount of time (orto simulate 
    if (DELAY_DELIVERY)
    {
        var randomNumber = 1 + (Math.random() * 5000);
        console.log("Serving " + imageCount + " images after a delay of " + randomNumber / 1000 + " seconds.");
    }
    else
    {
        console.log("Serving " + imageCount + " images");
    }

    if (!DO_NOT_DELIVER)
    {
        setTimeout(function(){ res.send(imageData); }, randomNumber);
    }
});

app.listen(PORT_NUMBER, function()
{
    console.log("Images being served on port " + PORT_NUMBER);
});