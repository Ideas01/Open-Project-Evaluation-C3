/** a puzzle builder for a 5 x 3 Grid Puzzle **/



function PuzzleBuilder() {}


/** calculate the Width of the puzzle divs, depending on the image width  **/
function calculateWidth(imageWidth,divCountHorizontal) {
    return imageWidth/divCountHorizontal;
}

/** calculate the height of the puzzle divs, depending on the image height **/
function calculateHeight (imageHeight,divCountVertical) {
    return imageHeight/divCountVertical;
}

/** onclick function to hide a div object **/
function hideDiv(element){
     element.style.visibility = "hidden";
     console.log("Element ID ist: " + element.id);
}

/** Build the puzzle **/
PuzzleBuilder.prototype.buildPuzzle = function (imageWidth,imageHeight,divCountHorizontal, divCountVertical) {
    //calculate width and height for the divs
    var divWidth = calculateWidth(imageWidth,divCountHorizontal);
    var divHeight = calculateHeight(imageHeight,divCountVertical);

    console.log("PuzzleBuilder divWidth: " + divWidth );
    console.log("PuzzleBuilder divHeight: " + divHeight);

    //calculate div count
    var divCount = divCountVertical * divCountHorizontal;

    //create the div elements
    for (var i = 1; i <= divCount; i++){
        var newDiv = document.createElement("div");
            newDiv.id = i;
            newDiv.className = "puzzlePiece";
            newDiv.style.visibility = "visible";
            newDiv.style.width= divWidth +"px";
            newDiv.style.height = divHeight + "px";

            //append newDiv to the DOM
            $(".puzzleDiv").append(newDiv);


            $('.puzzlePiece').each(function() {
                $(this).attr("onclick", "hideDiv(this)");
            });



    }

};



