// Array to be populated with finished Image objects
var slideshowImages = [];

// Tracks index of currently-displayed image
var currentImageIndex = 0;

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
const imageLoadPromise = httpGet("http://localhost:8001/", 3000);
addLoadingAnimation();
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

    // Clar slidewhow and push error image
    slideshowImages = [];
    slideshowImages.unshift(errorImage);
    setTimeout(function(){ drawNextImage(); }, 10); //TODO: Better yet: why does this draw only work with a delay?
}

// Loads loading animation from local storage, pushes it into the slideshow, and displays it
function addLoadingAnimation()
{
    var canvas = photoView;
    var context = canvas.getContext("2d");
    
    var loadingAnimation = {
        'source': null,
        'current': 0,
        'total_frames': 12,
        'width': 256,
        'height': 256
    };

    let loadingImage = new Image();
    loadingImage.onload = function()
    {
        loadingAnimation.source = loadingImage;
    }
    loadingImage.src = "image_service/other_images/loading.png";

    
    setInterval((function (c, i)
    {
        return function ()
        {
            if (!slideshowImages.length)
            {
                draw_anim(c, 10, 10, i);
            }
        };
    })(context, loadingAnimation), 100);
}

/*************************************/
function draw_anim(context, x, y, iobj) { // context is the canvas 2d context.
    if (iobj.source != null)
    {
        context.drawImage(iobj.source, iobj.current * iobj.width, 0,
                          iobj.width, iobj.height,
                          x, y, iobj.width, iobj.height);
        iobj.current = (iobj.current + 1) % iobj.total_frames;
        }
}
/*************************************/

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