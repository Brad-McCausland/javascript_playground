const imageFileNames =
[
    "images/awe.jpg",
    "images/excited.png",
    "images/fear.jpg",
    "images/impressed.jpg",
    "images/intense.jpg",
    "images/menacing.jpg",
    "images/mischief.jpg",
    "images/pleased.jpg",
    "images/risen.png",
    "images/surprised.jpg",
    "images/talking.jpg"
]

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