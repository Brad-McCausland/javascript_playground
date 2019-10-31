"use strict";
exports.__esModule = true;
var fs = require("fs");
var express = require("express");
var cors = require("cors");
var PORT_NUMBER = 8001;
var ALL_IMAGE_DIRECTORIES = ["album_images", "other_images"];
// Optional cmd line arguments for simulating network delay/interruption
var DELAY_DELIVERY = process.argv[2] == "delay" ? true : false;
var DO_NOT_DELIVER = process.argv[2] == "dnd" ? true : false;
// Dictionary of Dictionaries. Directory name keys a dictionary of filename -> base64 encoded images
var images = {};
var imageCount = 0;
// Load all files in all image directories. Keyed by directory name then file name.
ALL_IMAGE_DIRECTORIES.forEach(function (dirName) {
    var currentDirectoryImages = {};
    var currentDirectory = fs.readdirSync(dirName);
    currentDirectory.forEach(function (fileName) {
        var file = dirName + "/" + fileName;
        var encodedImage = new Buffer(fs.readFileSync(file)).toString('base64');
        currentDirectoryImages[fileName] = encodedImage;
        imageCount++;
    });
    images[dirName] = currentDirectoryImages;
});
// Convert array to JSON
var imageData = JSON.stringify(images);
// Create image-serving server
var app = express();
var delay = 0;
app.use(express.static(__dirname));
app.use(cors());
app.get('/', function (req, res) {
    // If debug, delay for a random amount of time (orto simulate 
    if (DELAY_DELIVERY) {
        delay = Math.random() * 5000;
        console.log("Serving " + imageCount + " images after a delay of " + delay / 1000 + " seconds.");
    }
    else {
        console.log("Serving " + imageCount + " images");
    }
    if (!DO_NOT_DELIVER) {
        setTimeout(function () { res.send(imageData); }, delay);
    }
});
app.listen(PORT_NUMBER, function () {
    console.log("Images being served on port " + PORT_NUMBER);
});
