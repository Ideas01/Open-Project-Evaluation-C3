/** a puzzle builder for a 5 x 3 Grid Puzzle **/



function PuzzleBuilder() {}

/** onclick function to hide a div object **/

function colorDiv(element){
	element.style.backgroundColor = "pink";
}

function hideDiv(element){
	element.style.visibility = "hidden";
	console.log(element.id);
}

//set croppedImageDiv background to none
function restorePuzzle(croppedID){
    $(croppedID).css('background-image', 'none');
}


/** Build the puzzle **/
PuzzleBuilder.prototype.buildPuzzle = function (tileCount, appendToDOM, namespace, color, setclassname) {
	var landscape = isLandscape();
	//create the div elements
    for (var k = 0; k < tileCount; k++){
       for(var l = 0; l < tileCount; l++){
		   //TODO: noch prüfung einbauen, dass keine doppelten id´s entstehen.
			var newDiv = document.createElement("div");
			newDiv.id = namespace + l + k;
			newDiv.className = setclassname;
			
            //append newDiv to the DOM
			if($(appendToDOM) && landscape == true){
				$(appendToDOM).append(newDiv).ready(function(){
					$('.' + setclassname).css({
						"visibility": "visible",
						"background-color": color 
					});
				});
			} else if($(appendToDOM) && landscape == false){
				
			}else {
				console.log("DOM Element konnte nicht gefunden werden.");
			}
		}
    }
	
	var tile = calculateTileSize(tileCount, setclassname); 
	

};

PuzzleBuilder.prototype.buildPuzzleTiles = function (tileCount, appendToDOM, namespace, color, setclassname, clickedPuzzleTiles) {

    //create the div elements
    for (var k = 0; k < tileCount; k++){
        for(var l = 0; l < tileCount; l++){
            //TODO: noch prüfung einbauen, dass keine doppelten id´s entstehen.
            var newDiv = document.createElement("div");
            newDiv.id = namespace + l + k;
            newDiv.className = setclassname;
			if(clickedPuzzleTiles.includes(newDiv.id)){
                newDiv.style.visibility = "hidden";
			}
			else {
                newDiv.style.visibility = "visible";
            }
            newDiv.style.backgroundColor = color;
            //append newDiv to the DOM
            if($(appendToDOM)){
                $(appendToDOM).append(newDiv);
            } else{
                console.log("DOM Element konnte nicht gefunden werden.");
            }
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
		//TODO: zwischen ID und class unterscheiden
		var percentageTileSize = 1/tileCount * 100;
			$('.' + setclassname).css({"width" : percentageTileSize +'%', "height" : percentageTileSize +'%'});
	}


	function isLandscape(){
		if ($(window).width() >= $(window).height()){
			console.log("yup");
			return true;
		}else{
			console.log("nö")
			return false; 
		}
	}
