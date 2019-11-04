//import * as SlideShowView from "./SlideShowView.js";
import { SlideShowView } from './SlideShowView.js';

// Edit header element using js
var heading = document.querySelector('h1');
if (heading)
{
    heading.textContent = "Brad McCausland";
}

// Create slideShowView element
var slideShowView = new SlideShowView({"width": 400, "height": 400});
document.body.appendChild(slideShowView.canvas);

loadImages();

// Click action cycles through images
slideShowView.canvas.onclick = function(): void
{
    if (slideShowView.isError())
    {
        loadImages()
    }
    else if (slideShowView.isComplete())
    {
        slideShowView.drawNextImage();
    }
}

/*
// Click action for button using jquery
$(document).ready(function() {
    $("button").on("click", function()
    {
        console.log("click");
        alert("clicked!");
    });
});
*/

function loadImages(): void
{
    // Attempt to load images from image service with three second timeout
    slideShowView.addLoadingAnimation();
    const imageLoadPromise = httpGet("http://localhost:8001/", 3000);
    imageLoadPromise.then(function(result: unknown)
    {
        if (typeof result === "string")
        {console.log("Images loaded successfully");
        decodeImages(result, slideShowView, function(){ setTimeout(function() {slideShowView.drawNextImage();}, 0);});
    }
    }).catch(function(error: string)
    {
        console.log("Images failed to load with error: " + error);
        slideShowView.addErrorImage(function(){ slideShowView.drawNextImage(); });
    });
}

// Takes the result of calling image service, unpacks the data into images, and loads them into the slideshow array
function decodeImages(imageData: string, slideShow: SlideShowView, callback?: () => void): void
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
            slideShow.addImage(image);
        });
    }
    catch (error)
    {
        // If image service cannot be reached, push error message into slideshowImages[] instead
        slideShowView.addErrorImage(undefined);
        console.log("catch activated: " + error);
    }

    if (callback)
    {
        callback();
    }
}

// Attempts to reach the given url. Returns a promise that resolves with the response, and rejects after a specified number of seconds
function httpGet(url: string, timeLimit: number): Promise<string>
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