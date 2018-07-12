/** a puzzle builder for a 5 x 3 Grid Puzzle **/



function PuzzleBuilder() {}

/** onclick function to hide a div object **/
function hideDiv(element){
     element.style.visibility = "hidden";
     console.log("Element ID ist: " + element.id);
}

/** Build the puzzle **/
PuzzleBuilder.prototype.buildPuzzle = function (tileCount, tile) {
    
    //create the div elements
    for (var i = 1; i <= tileCount; i++){
        var newDiv = document.createElement("div");
            newDiv.id = i;
            newDiv.className = "puzzlePiece";
            newDiv.style.visibility = "visible";
            newDiv.style.width= tile.width +"px";
            newDiv.style.height = tile.height + "px";

            //append newDiv to the DOM
            $(".puzzleDiv").append(newDiv);


            $('.puzzlePiece').each(function() {
                $(this).attr("onclick", "hideDiv(this)");
            });
    }

};



