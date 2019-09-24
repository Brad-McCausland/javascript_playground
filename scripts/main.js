const imageFileNames =
[
    "image_service/images/awe.jpg",
    "image_service/images/excited.png",
    "image_service/images/fear.jpg",
    "image_service/images/impressed.jpg",
    "image_service/images/intense.jpg",
    "image_service/images/menacing.jpg",
    "image_service/images/mischief.jpg",
    "image_service/images/pleased.jpg",
    "image_service/images/risen.png",
    "image_service/images/surprised.jpg",
    "image_service/images/talking.jpg"
]

//var data = httpGet("10.0.0.29:8001");
console.log("request");
//console.log(data);

// Preload image objects into array
var imageFiles = [];

for (i = 0; i < imageFileNames.length; i++)
{
    let newImage = new Image(400, 400);
    newImage.src = imageFileNames[i];
    imageFiles.unshift(newImage);
}

let currentImageIndex = 0;

// Edit header element using js
let heading = document.querySelector('h1');
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
    currentImageIndex = (currentImageIndex + 1) % imageFileNames.length
    let newImage = imageFiles[currentImageIndex];
    context.drawImage(newImage, 0, 0, 400, 400);
}

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}