
function getImageUrl( urlArray,imageIndex)
{
    return urlArray[imageIndex];
}

//js Object, which contains all necessary attributes
var imageArray = {
    imageUrls:  ["https://thumbnails-visually.netdna-ssl.com/the-10-commandments-of-user-interface-design_553e21765c690_w1500.png",
        "https://weandthecolor.com/wp-content/uploads/2017/05/User-Interface-designs-by-Balraj-Chana-1068x591.jpg",
        "https://cdn-images-1.medium.com/max/2000/1*_tkd0q6CFkepowjFZHRSSg.jpeg"],
    startIndex: 0,
    currentIndex: undefined,
    maxIndex: undefined,
};

$("document").ready(function () {

    imageArray.currentIndex = imageArray.startIndex;
    imageArray.maxIndex = imageArray.imageUrls.length -1;
    console.log("image-array: current index: " + imageArray.currentIndex);
    console.log("image-array: maxIndex:" + imageArray.maxIndex);

    //create div, which displays the prototype images
    var imageDiv = document.createElement("div");
    imageDiv.style.backgroundImage = "url("+ getImageUrl(imageArray.imageUrls,imageArray.currentIndex);
    imageDiv.className = "imageDiv";
    imageDiv.style.backgroundSize = "contain";
    imageDiv.style.backgroundRepeat = "no-repeat";
    imageDiv.style.width = "100%";
    imageDiv.style.height = "100%";

    $(".page-content").append(imageDiv);

    //add click functionality for the right(next) chevron
    $(".next-link").click(function () {
        if(imageArray.currentIndex < imageArray.maxIndex){
            imageDiv.style.backgroundImage = "url(" + getImageUrl(imageArray.imageUrls,++imageArray.currentIndex) + ")";
            console.log("currentIndex nach next-click: " + imageArray.currentIndex);
        }
        else if(imageArray.currentIndex == imageArray.maxIndex){
            console.log("prototyp zuende");
        }
    });

    //add click functionality for the left(next) chevron
    $(".back-link").click(function () {
        if(imageArray.currentIndex > 0) {
            imageDiv.style.backgroundImage = "url(" + getImageUrl(imageArray.imageUrls, --imageArray.currentIndex);
            console.log("currentIndex nach dem back-click: " + imageArray.currentIndex);
        }
        else if(imageArray.currentIndex==0){
            console.log("mehr als 0 geht nicht");
        }
    });
});