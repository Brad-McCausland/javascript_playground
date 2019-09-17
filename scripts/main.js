const imageFileNames =
[
    "awe.jpg",
    "excited.png",
    "fear.jpg",
    "impressed.jpg",
    "intense.jpg",
    "menacing.jpg",
    "mischief.jpg",
    "pleased.jpg",
    "risen.png",
    "surprised.jpg",
    "talking.jpg"
]

let currentImageIndex = 0;

// Edit header element using js
let heading = document.querySelector('h1');
heading.textContent = "Glory to you!";

// Create canvas element
var canvas = document.createElement('canvas');
canvas.width = 400;
canvas.height = 400;
document.body.appendChild(canvas);

// create image
var img = new Image(400, 400);
img.id = "main_image";
img.src = "images/gowron.jpg";
canvas.onclick = function()
{
    console.log("Click");
    drawNextImage();
}

// Draw image to canvas
var context = canvas.getContext('2d');
context.drawImage(img, 0, 0, 400, 400);


function drawNextImage()
{
    currentImageIndex = (currentImageIndex + 1) % imageFileNames.length
    let newImageName = `images/${imageFileNames[currentImageIndex]}`

    let newImage = new Image(400, 400);
    newImage.src = newImageName
    console.log(newImageName);
    context.drawImage(newImage, 0, 0, 400, 400);
}