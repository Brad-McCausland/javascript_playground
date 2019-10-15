
// Array to be populated with finished Image objects
var slideshowImages = [];

$(document).ready(function() {
    $("button").on("click", function()
    {
        console.log("click");
        alert("clicked!");
    });
});

// Try loading images from image service
try
{
    // Raw json data from image service
    const imageData = httpGet("http://localhost:8001/");

    // Array of images in Base64 
    const allImages = JSON.parse(imageData);

    // Convert each file under 'album_images' from Base64 into an image object. Push finished objects onto slideshowImages[].
    var albumImages = allImages["album_images"]
    Object.keys(albumImages).forEach(function(key)
    {
        let src = "data:image/jpeg;base64,"
        src += albumImages[key];
        let image = new Image();
        image.src = src;
        slideshowImages.unshift(image);
    });
}
catch (error)
{
    // If image service cannot be reached, push error message into slideshowImages[] instead
    let errorImage = new Image();
    errorImage.src = "image_service/other_images/image_load_error.png";
    
    slideshowImages.unshift(errorImage);
    console.log("catch activated: " + error);
}

// Tracks index of currently-displayed image
var currentImageIndex = 0;

// Edit header element using js
var heading = document.querySelector('h1');
heading.textContent = "Glory to you!";

// Create canvas element
var canvas = document.createElement('canvas');
canvas.width = 400;
canvas.height = 400;
canvas.display = "inline-block"
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
    currentImageIndex = (currentImageIndex + 1) % slideshowImages.length
    let newImage = slideshowImages[currentImageIndex];
    context.drawImage(newImage, 0, 0, 400, 400);
}

function httpGet(url)
{
    var xmlHttp = new XMLHttpRequest();
    //TODO: Remove syncronous call on the main thread
    xmlHttp.open( "GET", url, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}