var data = httpGet("http://localhost:9001/");
var imageArray = JSON.parse(data);

// Preload image objects into array
var imageFiles = [];

imageArray.forEach(function(element) {
    var src = "data:image/jpeg;base64,";;
    src += element;
    let image = new Image();
    image.src = src;
    imageFiles.unshift(image);
});

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