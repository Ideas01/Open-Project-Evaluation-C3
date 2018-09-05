/** a puzzle builder for a 5 x 3 Grid Puzzle **/



function PuzzleBuilder() {}

/** onclick function to hide a div object **/
function hideDiv(element){
     element.style.visibility = "hidden";
}



	
/** Build the puzzle **/
PuzzleBuilder.prototype.buildPuzzle = function (tileCount, appendToClass, namespace, color, setclassname) {
	
	//create the div elements
    for (var i = 0; i < tileCount; i++){
       for(var n = 0; n < tileCount; n++){
		   //TODO: noch prüfung einbauen, dass keine doppelten id´s entstehen.
			var newDiv = document.createElement("div");
			newDiv.id = namespace + '|' + i + "|" + n;
			
            newDiv.className = setclassname;
            newDiv.style.visibility = "visible";
			newDiv.style.backgroundColor = color;
            //append newDiv to the DOM
            $(appendToClass).append(newDiv);
			
			
            $('.' + setclassname).each(function() {
                $(this).attr("onclick", "hideDiv(this)");
            });
		}
    }
	
	var tile = calculateTileSize(tileCount, setclassname); 
	

};

	/*tileCountWidth has been set to 12.
	It has been generated with the following formular:
	 * short side of a Nexus 6: 412 px as a minimum length;
	 * minimum length (412px) / minimum touchable width (32px)
	 * only the int value has been considered valid, because only complete tiles are necessary.
	*/
	function calculateTileSize(tileCount, setclassname){	
		var percentageTileSize = 1/tileCount * 100;
		$('.' + setclassname).css({"width" : percentageTileSize +'%', "height" : percentageTileSize +'%'});
		
	}



