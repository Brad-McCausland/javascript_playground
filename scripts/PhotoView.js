/* 
 * Class PhotoView is a canvas element with additional properties/behaviors that allow for a group
 * of images to be cycled through on click. The constructor takes a dictionary of values in order to
 * provide flexibility when creating the object. Any value not given when instantiating is replaced
 * with a default value.
 */

class PhotoView {
    constructor(values)
    {
        this.canvas = document.createElement('canvas');

        this.canvas.width   = values["width"]   || 400;
        this.canvas.height  = values["height"]  || 400;
        this.canvas.display = values["display"] || "inline-block";

        this.images = [];
        this.currentImageIndex = 0;
        this.intervalID = null;
    }

    addImage(image)
    {
        if (image instanceof Image)
        {
            if (!this.images.length)
            {
                // Remove loading animation if this is the first time an image is added
                clearInterval(this.intervalID);
            }

            this.images.unshift(image);
        }
    }

    // Loads error image from local storage, pushes it into the slideshow, and displays it
    addErrorImage()
    {
        let errorImage = new Image();
        errorImage.src = "image_service/other_images/image_load_error.png";

        // Clear slideshow and push error image
        this.clearImages()
        this.addImage(errorImage)
        
        setTimeout(function(){ drawNextImage(); }, 10); //TODO: Better yet: why does this draw only work with a delay?
        
        // Remove loading animation
        clearInterval(this.intervalID);
    }

    clearImages()
    {
        this.images = [];
    }

    // Advance current image index and use it to display the next image
    drawNextImage()
    {
        // do nothing if images not loaded
        if (this.images.length)
        {
            this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length
            let newImage = this.images[this.currentImageIndex];
            var context = this.canvas.getContext('2d');
            context.drawImage(newImage, 0, 0, 400, 400);
        }
    }

    // Loads loading animation from local storage and displays it in photo view
    addLoadingAnimation()
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
        
        if (!this.images.length)
        {
            // Center loading image in the loading view
            let width = (this.canvas.width - 256)/2
            let height = (this.canvas.height - 256)/2

            this.intervalID = setInterval(this.animateImageInCanvas, 100, this.canvas.getContext("2d"), width, height, loadingAnimation);
        }
    }

    animateImageInCanvas(context, x, y, iobj)
    {
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
}