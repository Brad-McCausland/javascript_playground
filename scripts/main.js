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
heading.textContent = "Hello world";

// Select main image element
let myImage = document.querySelector('img');

myImage.onclick = function()
{
    currentImageIndex = (currentImageIndex + 1) % imageFileNames.length
    var newImgName = `images/${imageFileNames[currentImageIndex]}`

    let mySrc = myImage.getAttribute('src');

    myImage.setAttribute ('src', newImgName);
}
