/* 
 * Class SlideShowView encapsulates properties/behaviors that allow for a group of images to be displayed in a
 * single element, and to be cycled through by click. The constructor takes a dictionary of values in order to
 * provide flexibility when creating the object. Any value not given when instantiating is replaced
 * with a default value. To display a SlideShowView, client code must add the SlideShowView's canvas property to the
 * document body.
 */

var stateEnum =
{
    EMPTY: 0,
    LOADING: 1,
    COMPLETE: 2,
    ERROR: 3
};

export class SlideShowView {

    canvas: HTMLCanvasElement;
    state: number;
    images: HTMLImageElement[];
    currentImageIndex: number;
    intervalID?: number
    errorImage: HTMLImageElement;

    constructor(values: {[key: string]: any})
    {
        // Create displayable canvas element
        this.canvas = document.createElement('canvas');

        // Handle initializing arguments
        this.canvas.width   = typeof values["width"]  === "number" ? values["width"]  : 400;
        this.canvas.height  = typeof values["height"] === "number" ? values["height"] : 400;

        this.state = stateEnum.EMPTY;

        // Array of image objects displayed by the SlideShowView
        this.images = [];

        // Index of current image in this.images that's being displayed
        this.currentImageIndex = 0;

        // ID of interval used to animate loading icon
        this.intervalID = undefined;

        // Error image
        this.errorImage = new Image();
        this.errorImage.src = "services/image_service/other_images/image_load_error.png";
    }

    isEmpty()
    {
        return this.state === stateEnum.EMPTY;
    }

    isLoading()
    {
        return this.state === stateEnum.LOADING;
    }

    isComplete()
    {
        return this.state === stateEnum.COMPLETE;
    }

    isError()
    {
        return this.state === stateEnum.ERROR;
    }

    addImage(image: HTMLImageElement)
    {
        this.state = stateEnum.COMPLETE;

        if (!this.images.length)
        {
            // Remove loading animation if this is the first time an image is added
            if (this.intervalID)
            {
                clearInterval(this.intervalID);
            }
        }
        this.images.unshift(image);
    }

    // Loads error image from local storage, pushes it into the slideshow, and displays it
    addErrorImage(callback?: () => void)
    {
        // Remove loading animation
        if (this.intervalID)
        {
            clearInterval(this.intervalID);
        }

        // Clear slideshow and push error image
        this.clearImages();
        this.addImage(this.errorImage);
        this.state = stateEnum.ERROR;

        if (callback)
        {
            callback();
        }
    }

    clearImages()
    {
        this.images = [];
    }

    // Advance current image index and use it to display the next image
    drawNextImage()
    {
        var context = this.canvas.getContext('2d');
        // do nothing if images not loaded
        if (this.images.length && context)
        {
            let newImage = this.images[this.currentImageIndex];
            context.drawImage(newImage, 0, 0, 400, 400);
            
            this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
        }
    }

    // Loads loading animation from local storage and displays it in photo view
    addLoadingAnimation()
    {
        this.images = [];
        this.state = stateEnum.LOADING;

        let loadingImage = new Image();
        loadingImage.src = "services/image_service/other_images/loading.png";

        var loadingAnimation = new AnimatableImage(loadingImage, 0, 12, 256, 256);

        if (!this.images.length)
        {
            // Center loading image in the loading view
            let width = (this.canvas.width - 256)/2;
            let height = (this.canvas.height - 256)/2;

            this.intervalID = window.setInterval(this.animateImageInCanvas, 100, this.canvas.getContext("2d"), width, height, loadingAnimation);
        }
    }

    animateImageInCanvas(context: CanvasRenderingContext2D, x: number, y: number, iobj: AnimatableImage)
    {
        if (iobj.source != null)
        {
            context.drawImage
            (
                iobj.source,                    // Image object
                iobj.currentFrame * iobj.width, 0,   // Coordinates of top left corner of sub-rectangle (multiply frame count by width to get current frame)
                iobj.width, iobj.height,        // Width and height of sub-rectangle
                x, y,                           // Destination in target canvas
                iobj.width, iobj.height         // Width and height to draw the source at
            );
            // Iterate one frame in image
            iobj.currentFrame = (iobj.currentFrame + 1) % iobj.totalFrames;
        }
    }
}

class AnimatableImage
{
    source: HTMLImageElement;
    currentFrame: number;
    totalFrames: number;
    width: number;
    height: number;

    constructor(source: HTMLImageElement, currentFrame: number, totalFrames: number, width: number, height: number)
    {
        this.source = source;
        this.currentFrame = currentFrame;
        this.totalFrames = totalFrames;
        this.width = width;
        this.height = height;
    }
}