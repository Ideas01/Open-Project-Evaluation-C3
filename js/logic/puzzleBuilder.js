/** a puzzle builder for a 5 x 3 Grid Puzzle **/



function PuzzleBuilder() {}

function hideDiv(element){
	element.style.visibility = "hidden";
	console.log(element.id);
}

//set croppedImageDiv background to none
function restorePuzzle(croppedID){
    $(croppedID).css('background-image', 'none');
}

var puzzleGridWrapper = "#puzzleGridWrapper";


PuzzleBuilder.prototype.buildPuzzle = function (imageObject, wrapperDom, puzzlePieceCount, color, clickedPuzzlePieces, overallGridSize){		
		var namespace = wrapperDom.split(wrapperDom.charAt(0));
		namespace = namespace[1];
		var buildPuzzleNameId = [namespace + 'Grid'];
		var buildPuzzleNameClass = [namespace + 'GridDiv'];
		var buildPuzzlePiecesId = [namespace + 'puzzlePiece'];
		var buildPuzzlePiecesClass = [namespace + 'puzzlePieceDiv'];
		var overallGridSizeNew = 4;
		
		
		new Promise(function(){
			var overallGridWrapper = '<div id="'+ puzzleGridWrapper.split(wrapperDom.charAt(0))[1] +'"></div>';
		$(wrapperDom).parent().append(overallGridWrapper);
		}).then(function(){
			singleAccess.calculateWrapperSize(imageObject, wrapperArray, 80);
			PuzzleBuilder.prototype.calculateWrapperSize(imageObject, wrapperArray, 80);
		});
		
		/**building the small pieces **/
		
		if(overallGridSize != "" && $.isNumeric(overallGridSize)){
			overallGridSizeNew = overallGridSize;
		} else{
			//TODO exception werfen
			var errormsg = "Die gegebene gridSize ist keine Nummer";
			console.log(errormsg);
		}
		
		let clickedPuzzleTiles = [];
		
		let gridReady = new Promise(function (resolve, reject) {
			PuzzleBuilder.prototype.buildPuzzleOld(puzzlePieceCount / 4, wrapperDom, buildPuzzleNameId, "", buildPuzzleNameClass);
			resolve(0);
		});
		
		gridReady.then(function (fulfilled) {
			$('.' + buildPuzzleNameClass).css({
				"z-index": "5",
				"position": "relative",
				"display": "inline-block"
			});
			
			$('.' + buildPuzzleNameClass).each(function (n) {
				for (var i = 0; i < 3; i++) {
					PuzzleBuilder.prototype.buildPuzzleTiles(puzzlePieceCount / 3, ['#' + buildPuzzleNameId] + n + i, buildPuzzlePiecesId + n + i, "blue", buildPuzzlePiecesClass, clickedPuzzleTiles);
				}
			});

			$('.' + buildPuzzlePiecesClass).click(function (event) {
				event.target.style.visibility = "hidden";
				clickedPuzzleTiles.push(event.target.id);
			});
		}).then(function(){
			$('.' + buildPuzzlePiecesClass).css({
				"z-index": "6",
				"position": "relative",
				"display": "inline-block",
				"box-sizing": "border-box",
				"-moz-box-sizing": "border-box",
				"-webkit-box-sizing": "border-box",
				"border": "solid 1px #0000db"
			});
		});
};




//** Build the puzzle **/
PuzzleBuilder.prototype.buildPuzzleOld = function (tileCount, appendToDOM, namespace, color, setclassname) {
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
       // PuzzleBuilder.prototype.buildPuzzleOld(4, '#miniOverview', "miniOverviewGrid","", "miniOverviewGridPiece");
        PuzzleBuilder.prototype.buildPuzzleOld(4, appendToDOMOverview, namespaceOverview,"", classNameOverview);
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
	if(elementArray.includes(puzzleGridWrapper)){
	}else{
		elementArray.push(puzzleGridWrapper);
	}
	console.log(elementArray);
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
