// Raw json data from image service
const imageData = httpGet("http://localhost:8001/");

// Array of images in Base64 
const imageArray = JSON.parse(imageData);

// Array to be populated with finished Image objects
var imageFiles = [];

// Convert each element in imageArray from Base64 into an image object. Push finished objects onto imageFiles[].
imageArray.forEach(function(imageData) {
    let src = "data:image/jpeg;base64,";;
    src += imageData;
    let image = new Image();
    image.src = src;
    imageFiles.unshift(image);
});

// Tracks index of currently-displayed image
var currentImageIndex = 0;

// Edit header element using js
var heading = document.querySelector('h1');
heading.textContent = "Glory to you!";

// Create canvas element
var canvas = document.createElement('canvas');
canvas.width = 400;
canvas.height = 400;
document.body.appendChild(canvas);

canvas.onclick = function()
{
    drawNextImage();
}

window.onload = function()
{
    drawNextImage();
}

function drawNextImage()
{
    var context = canvas.getContext('2d');
    currentImageIndex = (currentImageIndex + 1) % imageFiles.length
    let newImage = imageFiles[currentImageIndex];
    context.drawImage(newImage, 0, 0, 400, 400);
}

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    //TODO: Remove syncronous call on the main thread
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}