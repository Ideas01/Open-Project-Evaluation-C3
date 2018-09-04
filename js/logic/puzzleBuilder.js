/** a puzzle builder for a 5 x 3 Grid Puzzle **/



function PuzzleBuilder() {}

/** onclick function to hide a div object **/
function hideDiv(element){
     element.style.visibility = "hidden";
	 element.style.zIndex = "0";
     console.log("Element ID ist: " + element.id);
}



	
/** Build the puzzle **/
PuzzleBuilder.prototype.buildPuzzle = function (tileCount, appendToClass, color) {
	
	var imgObj = new Image();
	imgObj.src = "https://static.geo.de/bilder/17/d1/57813/facebook_image/meer-c-8977765.jpg";
		
	var tile = calculateTileSize(tileCount); 
	//create the div elements
    for (var i = 0; i < tileCount; i++){
       for(var n = 0; n < tileCount; n++){
			var newDiv = document.createElement("div");
			newDiv.id = i + "|" + n;
			
            newDiv.className = "puzzlePiece";
            newDiv.style.visibility = "visible";
			newDiv.style.backgroundColor = color;
            newDiv.style.width= tile.width +"px";
            newDiv.style.height = tile.height + "px";
            //append newDiv to the DOM
            $(appendToClass).append(newDiv);
		
            $('.puzzlePiece').each(function() {
                $(this).attr("onclick", "hideDiv(this)");
            }); 
		}
    }
	
	$("#puzzleDiv").css("backgroundImage", 'url("'+ imgObj.src+ '")');
};

	/*tileCountWidth has been set to 12.
	It has been generated with the following formular:
	 * short side of a Nexus 6: 412 px as a minimum length;
	 * minimum length (412px) / minimum touchable width (32px)
	 * only the int value has been considered valid, because only complete tiles are necessary.
	*/
	function calculateTileSize(tileCount){	
		
		var picWidth= $("#puzzleDiv").width();
		var picHeight= $("#puzzleDiv").height();
		
		
		var picFormat = picWidth/ picHeight;
			
			var tile={
				width:picWidth / tileCount,
				height:picHeight / tileCount
			}		
		return tile;
		
	}



