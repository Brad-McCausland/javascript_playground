// Array to be populated with finished Image objects
var slideshowImages = [];

// Tracks index of currently-displayed image
var currentImageIndex = 0;

var intervalID = null;

// Edit header element using js
var heading = document.querySelector('h1');
heading.textContent = "Brad McCausland";

// Create photoView element
var photoView = document.createElement('canvas');
photoView.width = 400;
photoView.height = 400;
photoView.display = "inline-block"
document.body.appendChild(photoView);

// Click action cycles through images
photoView.onclick = function()
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

// Attempt to load images from image service with three second timeout
addLoadingAnimation();
const imageLoadPromise = httpGet("http://localhost:8001/", 3000);
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
    
    // Remove loading animation
    clearInterval(intervalID);

    setTimeout(function(){ drawNextImage(); }, 0); // TODO: Why does this need to be on a separate thread?
}

// Loads error image from local storage, pushes it into the slideshow, and displays it
function addErrorImage()
{

    let errorImage = new Image();
    errorImage.src = "image_service/other_images/image_load_error.png";

    // Clar slidewhow and push error image
    slideshowImages = [];
    slideshowImages.unshift(errorImage);
    
    // Remove loading animation
    clearInterval(intervalID);

    setTimeout(function(){ drawNextImage(); }, 10); //TODO: Better yet: why does this draw only work with a delay?
}

// Loads loading animation from local storage and displays it in photo view
function addLoadingAnimation()
{
    let loadingImage = new Image();
    loadingImage.src = "image_service/other_images/loading.png";
    
    var loadingAnimation = {
        'source': loadingImage,
        'current': 0,
        'total_frames': 12,
        'width': 256,
        'height': 256
    };
    
    if (!slideshowImages.length)
    {
        // Center loading image in the loading view
        let width = (photoView.width - 256)/2
        let height = (photoView.height - 256)/2

        intervalID = setInterval(animateImageInCanvas, 100, photoView.getContext("2d"), width, height, loadingAnimation);
    }
}

function animateImageInCanvas(context, x, y, iobj) {
    if (iobj.source != null)
    {
        context.drawImage(
            iobj.source,                    // Image object
            iobj.current * iobj.width, 0,   // Coordinates of top left corner of sub-rectangle (multiply frame count by width to get current frame)
            iobj.width, iobj.height,        // Width and height of sub-rectangle
            x, y,                           // Destination in target canvas
            iobj.width, iobj.height         // Width and height to draw the source at
        );
        // Iterate one frame in image
        iobj.current = (iobj.current + 1) % iobj.total_frames;
    }
}

// Advance current image index and use it to display the next image
function drawNextImage()
{
    // do nothing if images not loaded
    if (slideshowImages.length)
    {
        var context = photoView.getContext('2d');
        currentImageIndex = (currentImageIndex + 1) % slideshowImages.length
        let newImage = slideshowImages[currentImageIndex];
        context.drawImage(newImage, 0, 0, 400, 400);
    }
}

// Attempts to reach the given url. Returns a promise that resolves with the response, and rejects after a specified number of seconds
function httpGet(url, timeLimit)
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
        setTimeout(function(){ reject(Error("Timeout after 3 seconds")) }, timeLimit);
    })
}