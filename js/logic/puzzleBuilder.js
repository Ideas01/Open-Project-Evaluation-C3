/** a puzzle builder for a 5 x 3 Grid Puzzle **/



function PuzzleBuilder() {}

/** onclick function to hide a div object **/
function hideDiv(element){
     element.style.visibility = "hidden";
     console.log("Element ID ist: " + element.id);
}



	
/** Build the puzzle **/
PuzzleBuilder.prototype.buildPuzzle = function (tileCount) {
	
	//console.log("count: " + tileCount);
	
	var tile = calculateTileSize(tileCount); 
	
	console.log("breite: "+ tile.width + "height: " + tile.height);
	
	//create the div elements
    for (var i = 1; i <= tileCount*tileCount; i++){
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

	/*tileCountWidth has been set to 12.
	It has been generated with the following formular:
	 * short side of a Nexus 6: 412 px as a minimum length;
	 * minimum length (412px) / minimum touchable width (32px)
	 * only the int value has been considered valid, because only complete tiles are necessary.
	*/
	function calculateTileSize(tileCount){	
		
		var picWidth= $(".puzzleDiv").width();
		var picHeight= $(".puzzleDiv").height();
		
		console.log("pichheight + picwidth: "+ picHeight +" + "+ picWidth)
		
		var picFormat = picWidth/ picHeight;
		console.log("picFormat: "+ picFormat)
			
			var tile={
				width:picWidth / tileCount,
				height:picHeight / tileCount
			}		
		return tile;
		
	}



