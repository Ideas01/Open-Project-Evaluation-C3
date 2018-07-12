
$('document').ready(function () {
    var windowWidth = window.screen.width;
    var windowHeight = window.screen.height;



    var image = new Image(windowWidth, windowHeight);
    image.src = "http://image.wallpaperlistings.com/bigphoto/97/971504/wallpaper-1920x1080-hd-1080p.jpg";
    image.className = "puzzleImg"

    function gdc(a,b) {
        if (b === 0)
            return a;
        return gdc(b, a % b);
    }

    function determineFormat(windowWidth,windowHeight) {
        //find die greatest common divisor
        var ratio = gdc(windowWidth,windowHeight);
        console.log("Dimension width: " + windowWidth);
        console.log("Dimension height: " + windowHeight);
        console.log("GDC: " + ratio);
        console.log("aspect: " + windowWidth/ratio + ":" + windowHeight/ratio);
        return ratio;

    }

    var divCountHorizontal = windowWidth/gdc(windowWidth,windowHeight);
    var divCountVertical = windowHeight/gdc(windowWidth,windowHeight);

    image.onload = function () {
        $(".puzzleDiv").append(image);



        determineFormat(windowWidth, windowHeight);

        var imageWidth = image.width;
        var imageHeight = image.height;

        console.log(imageWidth);
        console.log(imageHeight);

        var puzzleBuilder = new PuzzleBuilder();

        puzzleBuilder.buildPuzzle(imageWidth, imageHeight,divCountHorizontal, divCountVertical);
    };
});