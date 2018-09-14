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


//** Build the puzzle **/
PuzzleBuilder.prototype.buildPuzzle = function (tileCount, appendToDOM, namespace, color, setclassname) {
	console.log("baue puzzle: " + namespace)
	//create the div elements
    for (var k = 0; k < tileCount; k++){
       for(var l = 0; l < tileCount; l++){
		   //TODO: noch prüfung einbauen, dass keine doppelten id´s entstehen.
			var newDiv = document.createElement("div");
			newDiv.id = namespace + l + k;
			newDiv.className = setclassname;
			
            //append newDiv to the DOM
			if($(appendToDOM)){
				$(appendToDOM).append(newDiv).ready(function(){
					$('.' + setclassname).css({
						"visibility": "visible",
						"background-color": color,
					});
				});
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

 PuzzleBuilder.prototype.buildMiniOverview = function(image, div, appendToDOMOverview, namespaceOverview, classNameOverview, appendToDOMTiles, namespaceTiles, classNameTiles){
    console.log(image);
   var miniOverviewClickedPuzzleTiles = ["miniOverviewPuzzletile0010","miniOverviewPuzzletile1121", "miniOverviewPuzzletile3322", "miniOverviewPuzzletile0020", "miniOverviewPuzzletile2320"];
	var divArray = [div];
	PuzzleBuilder.prototype.calculateWrapperSize(image, divArray, '100%');
    $(div).css("background-image", 'url("'+ image.src + '")');
	
	
    var gridReady = new Promise(function (resolve, reject) {
       // PuzzleBuilder.prototype.buildPuzzle(4, '#miniOverview', "miniOverviewGrid","", "miniOverviewGridPiece");
        PuzzleBuilder.prototype.buildPuzzle(4, appendToDOMOverview, namespaceOverview,"", classNameOverview);
        resolve("ready");
    });

    gridReady.then(function (fulfilled) {
        //$(".gridPiece").each(function (n) {
        $("." + classNameOverview).each(function (n) {
            for (var i = 0; i < 4; i++) {
                PuzzleBuilder.prototype.buildPuzzleTiles(3,appendToDOMTiles + n +i, namespaceTiles + n +i,"blue",classNameTiles,miniOverviewClickedPuzzleTiles);
                //PuzzleBuilder.prototype.buildPuzzleTiles(3, '#miniOverviewGrid' + n + i, "miniOverviewPuzzletile" + n + i, "blue", "miniOverviewPuzzlePiece", miniOverviewClickedPuzzleTiles);
            }
        });
    });
};




PuzzleBuilder.prototype.calculateWrapperSize = function (image, elementArray, percentageSize) {
   
	var landscape = isLandscape();
	console.log(elementArray)
	elementArray.forEach(function(element){
		 console.log("calculated wrapper: " + element)
		if(landscape == true){
			var imgFormat = image.width / image.height;
			
			new Promise(function(resolve){
				$(element).css("height", percentageSize + '%');
				resolve();
			}).then(function(){
				var elemHeight = $(element).ready().height();
				$(element).css("width", elemHeight * imgFormat + "px");
			});
		}else{
			var imgFormat = image.height / image.width;
			
			new Promise(function(resolve){
				$(element).css("width", percentageSize + '%');
				resolve();
			}).then(function(){
				var elemWidth = $(element).ready().width();
				$(element).css("height", elemWidth * imgFormat + "px"); 
			});
		}
	});
};
		


function isLandscape(){
		if ($(window).width() >= $(window).height()){
			console.log("yup");
			return true;
		}else{
			console.log("nö")
			return false; 
		}
	}
