// Array to be populated with finished Image objects
var slideshowImages = [];

// Tracks index of currently-displayed image
var currentImageIndex = 0;

// Edit header element using js
var heading = document.querySelector('h1');
heading.textContent = "Brad McCausland";

// Create canvas element
var canvas = document.createElement('canvas');
canvas.width = 400;
canvas.height = 400;
canvas.display = "inline-block"
document.body.appendChild(canvas);

// Click action cycles through images
canvas.onclick = function()
{
    if (slideshowImages.length)
    {
        drawNextImage();
    }
}

// Click action for button using jquery
$(document).ready(function() {
    $("button").on("click", function()
    {
        console.log("click");
        alert("clicked!");
    });
});

// Attempt to load images from image service
const imageLoadPromise = httpGet("http://localhost:8001/");
imageLoadPromise.then(function(result)
{
    console.log("Images loaded successfully");
    loadImages(result);
}).catch(function(error)
{
    console.log("Images failed to load with error: " + error);
    addErrorImage()
});

// Takes the result of calling image service, unpacks the data into images, and loads them into the slideshow array
function loadImages(imageData)
{
    try
    {
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
        addErrorImage();
        console.log("catch activated: " + error);
    }
    setTimeout(function(){ drawNextImage(); }, 0); // TODO: Why does this need to be on a separate thread?
}

// Loads error image from local storage, pushes it into the slideshow, and displays it
function addErrorImage()
{
    let errorImage = new Image();
    errorImage.src = "image_service/other_images/image_load_error.png";
    slideshowImages.unshift(errorImage);
    setTimeout(function(){ drawNextImage(); }, 10); //TODO: Better yet: why does this draw only work with a delay?
}

// Advance current image index and use it to display the next image
function drawNextImage()
{
    // do nothing if images not loaded
    if (slideshowImages.length)
    {
        var context = canvas.getContext('2d');
        currentImageIndex = (currentImageIndex + 1) % slideshowImages.length
        let newImage = slideshowImages[currentImageIndex];
        context.drawImage(newImage, 0, 0, 400, 400);
    }
}

// Attempts to reach the given url. Returns a promise that resolves with the response, and rejects after a three second timeout
function httpGet(url)
{
    return new Promise (function(resolve, reject)
    {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", url, true); // false for synchronous request
        xmlHttp.send(null);

        xmlHttp.onreadystatechange = function()
        {
            if (xmlHttp.readyState === 4)
            {
                resolve(xmlHttp.responseText);
            }
        }

        // Time out after 3 seconds
        setTimeout(function(){ reject(Error("Timeout after 3 seconds")) }, 3000);
    })
}