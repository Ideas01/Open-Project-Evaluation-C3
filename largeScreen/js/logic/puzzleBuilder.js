/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * puzzleBuilder.js 
 * 
 * factory to create puzzle's for 
 * 
 * required files:
 * - util.js
 * - puzzle.js
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
class PuzzleBuilder{
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * C O N S T R U C T O R   &   A T T R I B U T E S
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
	constructor()
	{
		this.util = new Util();
	} 
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * P R I V A T E - F U N C T I O N S
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
	
	/**
	priv_buildSmallPieces()
	
	builds the small pieces / tiles for the puzzle (for the main puzzle and the overview)
	
	parameters:
	- wrapperDom: (string) - identifier for the wrapper-div in the DOM.
	- puzzle: (puzzle) puzzle which shall be created (containing all the settings - see puzzle.js)
	*/
	priv_buildSmallPieces(wrapperDom, puzzle)
    {
        var thisisme = this;
        let namespace = wrapperDom.substring(1);
        var buildPuzzleNameId = [namespace + 'Grid'];
        var buildPuzzleNameClass = [namespace + 'GridDiv'];
        var buildPuzzlePiecesId = [namespace + 'puzzlePiece'];
        var buildPuzzlePiecesClass = [namespace + 'puzzlePieceDiv'];
        var miniOverviewIdName = this.buildMiniOverview ("#miniOverview",puzzle);
        var pointCount = Math.pow(puzzle.tileCountPerGrid * puzzle.gridCount, 2);

        let gridReady = new Promise(function (resolve, reject) {
            //buildPuzzleStructure(tileCount, appendToDOM, namespace, color, setclassname)
            buildPuzzleStructure(puzzle.gridCount, wrapperDom, buildPuzzleNameId, "none", buildPuzzleNameClass);
            resolve(0);
        });

        gridReady.then(function (fulfilled) {
            $('.' + buildPuzzleNameClass).css({
                "z-index": "5",
                "position": "relative",
                "display": "inline-block"
            });

            $('.' + buildPuzzleNameClass).each(function (n) {
                for (var i = 0; i < puzzle.gridCount; i++) {
                    thisisme.buildPuzzleTiles('#' + buildPuzzleNameId + n + i, buildPuzzlePiecesId + '|' + n + i, buildPuzzlePiecesClass.toString(), puzzle, puzzle.color);
                }
            });
			//TODO: LÖSCHEN WENN NICHT MEHR BENÖTIGT

            /*$('.' + buildPuzzlePiecesClass).click(function (event) {

                event.target.style.visibility = "hidden";
                let coordinate = (event.target.id).split('|');
                $('#'+ miniOverviewIdName + coordinate[1]).css('visibility', 'hidden');
                pointCount -= 1;
                $(puzzle.puzzlePointCounter).text(pointCount);
                puzzle.clickedPuzzleTiles.push(coordinate[1]);
            });
            */

        }).then(function(){
            $('.' + buildPuzzlePiecesClass).css({
                "z-index": "6",
                "position": "relative",
                "display": "inline-block",
                "box-sizing": "border-box",
                "-moz-box-sizing": "border-box",
                "-webkit-box-sizing": "border-box",
                "border": "solid 1px" + puzzle.bordercolor
            });
        });
	}
	
	/**
	priv_buildOverallGrid()
	
	creats a grid on the main puzzle, when the display is to small for a user to select a single tile.
	the grid allows the user to select a puzzle part and then 'zoom' in and select from a less number of tiles.
	
	parameters:
	- puzzle: (puzzle) object which shall be created (containing all the settings - see puzzle.js)
	*/
	priv_buildOverallGrid(puzzle)
	{
		new Promise(function(resolve){
			let namespace = puzzle.puzzleGridWrapper.substring(1);

			var buildPuzzleNameId = [namespace + '|'];
			var buildPuzzleNameClass = [namespace + 'Div'];
			
			let gridReady = new Promise(function (resolve, reject) {
				buildPuzzleStructure(3, puzzle.puzzleGridWrapper, buildPuzzleNameId, "none", buildPuzzleNameClass);
				
				$('.' + buildPuzzleNameClass).click(function (event) {
				var coordinateOld = null;
				var coordinate = null;
				
				
				var getOldCoordinate = new Promise(function(resolve){
					coordinateOld = (event.target.id).toString().split("|");
					resolve(coordinateOld);
				}); 
				
				getOldCoordinate.then(function(){
					coordinate = Array.from(coordinateOld[1]);
					$("#overallGridMarker").css({
						'height':'calc(99%/'+ puzzle.gridCount +')',
						'width': 'calc(99%/'+ puzzle.gridCount +')'
					});
					var gridMarker = $("#overallGridMarker");
					var xCoordinate = coordinate[0];
					var yCoordinate = coordinate[1];
					
					gridMarker.toggle();
					gridMarker.css({"left": gridMarker.width() * parseInt(xCoordinate, 10), "top": gridMarker.height() * parseInt(yCoordinate, 10) });
					
					$('.puzzleGridWrapperDiv').hide();
					$('.puzzleWrapperGridDiv:not(#puzzleWrapperGrid' + coordinateOld[1] + ')').toggle();
				
					cropImage(puzzle.imageObject, puzzle.imageObject.width * xCoordinate/3, puzzle.imageObject.height * yCoordinate/3,  puzzle.imageObject.width/3, puzzle.imageObject.height/3,  puzzle.imageObject.width, puzzle.imageObject.height);
					
					$('#puzzleWrapperGrid' + coordinateOld[1]).width('100%');
					$('#puzzleWrapperGrid' + coordinateOld[1]).height('100%');

					$('#puzzleWrapper').append('<a id="backButton"><i class="close-zoom f7-icons">close</i></a>');
					$('#backButton').click(function() {
						gridMarker.toggle();
						
						restorePuzzle('#croppedImageDiv');
						
						calculateTileSize(3,'puzzleWrapperGridDiv');
						$('.puzzleWrapperGridDiv:not(#puzzleWrapperGrid' + coordinateOld[1] + ')').toggle();
						$('.puzzleGridWrapperDiv').toggle();
						$('#backButton').remove()
					}).css({
						"position": "absolute",
						"z-index":"7",
						"top":"0",
						"right":"2%"
						
					});
				});
			});
			
			resolve(0);
		});
		gridReady.then(function(){
			$(puzzle.puzzleGridWrapper).css({
				"top": "-9999px",
				"bottom": "-9999px",
				"left": "-9999px",
				"right": "-9999px",
				"margin": "auto"
			});
			
			$('.' + buildPuzzleNameClass).css({
				"z-index": "5",
				"position": "relative",
				"display": "inline-block",
				"box-sizing": "border-box",
				"-moz-box-sizing": "border-box",
				"-webkit-box-sizing": "border-box",
				"border": "solid 1px" + puzzle.overallGridColor
			});
		});
		resolve(0);

	});
	}
	
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * P U B L I C - F U N C T I O N S
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
	/**
	buildPuzzle()
	
	creates a puzzle for a framework 7 page
	
	parameters:
	- wrapperDom: (string) - identifier for the wrapper-div in the DOM.
	- puzzle: (puzzle) object which shall be created (containing all the settings - see puzzle.js)
	*/
	buildPuzzle(wrapperDom, puzzle) {		
		var chk = new Checker("buildPuzzle");
		chk.isProperString(wrapperDom, "wrapperDom");
		chk.isValidClass(puzzle,"puzzle",'Puzzle');
		
		var thisisme = this;
		new Promise(function(){
			var overallGridWrapper = '<div id="'+ puzzle.puzzleGridWrapper.substring(1) +'"></div>';
			$(wrapperDom).parent().append(overallGridWrapper);
		}).then(function(){
			let wrapperArray = [];
			thisisme.calculateWrapperSize(puzzle, wrapperArray, 80);
		});

		this.priv_buildSmallPieces(wrapperDom, puzzle);

		
		this.priv_buildOverallGrid(puzzle);

};


    /**
     buildPuzzleWithoutOverallGrid()

     creates a puzzle, without an overlaying grid, for a framework 7 page

     parameters:
     - wrapperDom: (string) - identifier for the wrapper-div in the DOM.
     - puzzle: (puzzle) object which shall be created (containing all the settings - see puzzle.js)
     */

	buildPuzzleWithoutOverallGrid(wrapperDom, puzzle)
	{
        var chk = new Checker("buildPuzzle");
        chk.isProperString(wrapperDom, "wrapperDom");
        chk.isValidClass(puzzle,"puzzle",'Puzzle');

        var thisisme = this;
        new Promise(function(){
            var overallGridWrapper = '<div id="'+ puzzle.puzzleGridWrapper.substring(1) +'"></div>';
            $(wrapperDom).parent().append(overallGridWrapper);
        }).then(function(){
            let wrapperArray = [];
            thisisme.calculateWrapperSize(puzzle, wrapperArray, 80);
        });

        this.priv_buildSmallPieces(wrapperDom, puzzle);
	}

	/**
	buildPuzzleTiles()
	
	creates the puzzle-tiles for a puzzle
	
	parameters:
	- wrapperDom: (string) - identifier for the wrapper-div in the DOM.
	- namespace: (string) - prefix to all tile-divs
	- puzzle: (puzzle) object which shall be created (containing all the settings - see puzzle.js)
	- setclassname: (string) - classname for the tile-divs
	- color: (string) color identifier. You can select one of the colors contained in puzzle.
	*/
	buildPuzzleTiles(appendToDOM, namespace, setclassname, puzzle, color) {
		var chk = new Checker("buildPuzzleTiles");
		chk.isProperString(appendToDOM, "appendToDOM");
		chk.isProperString(namespace, "namespace");
		chk.isProperString(setclassname, "setclassname");
		chk.isValidClass(puzzle,"puzzle",'Puzzle');
		chk.isProperString(color, "color");
		//create the div elements
		for (var k = 0; k < puzzle.tileCountPerGrid; k++){
			for(var l = 0; l < puzzle.tileCountPerGrid; l++){
				//TODO: noch prüfung einbauen, dass keine doppelten id´s entstehen.
				var newDiv = document.createElement("div");
				newDiv.id = namespace + l + k;
				newDiv.className = setclassname;
				if(puzzle.clickedPuzzleTiles.includes(newDiv.id)){
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
		var tile = calculateTileSize(puzzle.tileCountPerGrid, setclassname);

	};

	hidePuzzlePiecesActivePuzzle(puzzlePieceIdArray) {
		console.log("puzzlePieceIdArray: ", puzzlePieceIdArray);
		
		if (Array.isArray(puzzlePieceIdArray) && typeof puzzlePieceIdArray !== 'undefined' && puzzlePieceIdArray.length > 0){
			let hidePiecesActivePuzzle = new Promise(function (resolve){
				puzzlePieceIdArray.forEach(function(element){
					document.getElementById(element).style.visibility = "hidden";
				});
				resolve(0);
			});
			return hidePiecesActivePuzzle;
			
		} else{
			console.log("Error: The passed array is not defined or empty");
		}
		
	};
	
    /**
	 *
	 * hides PuzzlePieces with a given ID over a certain amount of time
	 *
     * @param puzzlePieceIdArray: Array of strings, which contain the puzzlePiece ids
     */

    hidePuzzlePieces(puzzlePieceIdArray)
    {
    	if (typeof puzzlePieceIdArray !== 'undefined' && puzzlePieceIdArray.length > 0)
		{
            let i = 0;
            let iterations = puzzlePieceIdArray.length;

			let hidePieces = new Promise(function (resolve)
			{
                let hideInterval = setInterval(function ()
				{
                    document.getElementById(puzzlePieceIdArray[i]).style.visibility = "hidden";
                    i++;
                    if(i === iterations)
                    {
                        clearInterval(hideInterval);
                        resolve(0)
                    }
                }, puzzle.timeOut);
            });
            return hidePieces;
        }
		else
			{
    		console.log("Error: The passed array is not defined or empty");
			}
    }
	
	/**
	buildMiniOverview()
	
	creates the mini-puzzle which always displayed the whole puzzle (regardless of zooming)
	
	parameters:
	- appendToDOMOverview: (string) - identifier for the wrapper-div in the DOM.
	- puzzle: (puzzle) object which shall be created (containing all the settings - see puzzle.js)
	*/
	buildMiniOverview(appendToDOMOverview, puzzle){
		var chk = new Checker("buildMiniOverview");
		chk.isProperString(appendToDOMOverview, "appendToDOMOverview");
		chk.isValidClass(puzzle,"puzzle",'Puzzle');
		
		let namespace = appendToDOMOverview.substring(1);
		var buildMiniPuzzleNameId = [namespace + 'Grid'];
		var buildMiniPuzzleNameClass = [namespace + 'GridDiv'];
		var buildMiniPuzzlePiecesId = [namespace + 'miniPiece'];
		var buildMiniPuzzlePiecesClass = [namespace + 'miniPieceDiv'];
			
		var divArray = [appendToDOMOverview];
		
		this.calculateWrapperSize(puzzle, divArray, '100%');
		$(appendToDOMOverview).css("background-image", 'url("'+ puzzle.imageObject.src + '")');
		
		
		var gridReady = new Promise(function (resolve, reject) {
		   buildPuzzleStructure(puzzle.gridCount, appendToDOMOverview, buildMiniPuzzleNameId, "none", buildMiniPuzzleNameClass);
			$('.' + buildMiniPuzzleNameClass).css({
				'display': 'inline-block'
			});
			resolve("ready");
		});
		var thisisme = this;
		gridReady.then(function (fulfilled) {
				//$(".gridPiece").each(function (n) {
				$("." + buildMiniPuzzleNameClass).each(function (n) {
					
					for (var i = 0; i < puzzle.tileCountPerGrid; i++) {
						thisisme.buildPuzzleTiles('#' + buildMiniPuzzleNameId  + n + i, buildMiniPuzzlePiecesId + n + i,  buildMiniPuzzlePiecesClass.toString(), puzzle, puzzle.overviewColor);
					}
					$('.' + buildMiniPuzzlePiecesClass).css({
							'display': 'inline-block'
					});
				});
		}).then(function(){
			puzzle.clickedPuzzleTiles.forEach(function(puzzleIdNumber){
				$('#' + buildMiniPuzzlePiecesId + puzzleIdNumber).css('visibility', 'hidden');
			});
		});
		
		return buildMiniPuzzlePiecesId;
	};

	/**
	checkGrid()
	
	checks if a zooming-grid is necessary and sets the display-stile apropirate
	
	parameters:
	- wrapperDom: (string) - identifier for the wrapper-div in the DOM with the puzzle.
	*/
	checkGrid(wrapperDom){
		var chk = new Checker("checkGrid");
		chk.isProperString(wrapperDom, "wrapperDom");
 
		var wrapper = $(wrapperDom).ready();
		//var element = $(wrapperDom).children().first().children().first();
		var waitForE = setInterval(function(){
			let element = $(wrapperDom).children().first().children().first();
			if(element.width() > 0){
				clearInterval(waitForE);
				checkWidth(element);
			}
		});
		
		setTimeout(function(){
			 clearInterval(waitForE);			 //clear above interval after 15 seconds
			 //toDo exception.
		},16000);
		
		function checkWidth(element){	
			if(element.width() > 32 && element.height() > 32 ){
				wrapper.parent().children().last().css('display','none');
				$('#miniOverview').css({'display': 'none'});
			}
			else{
				$('#miniOverview').css({'display': 'block'});
				wrapper.parent().children().last().css('display','inline-block');
			}
		}
		
	}

	/**
	calculateWrapperSize()
	
	does all the math for displaying the puzzle appropriate.
	
	parameters:
	- puzzle: (puzzle) object which shall be created (containing all the settings - see puzzle.js)
	- elementArray: (string[]) array with all puzzle-wrappers
	- percentageSize: (string) relative size of the puzzle
	*/
	calculateWrapperSize(puzzle, elementArray, percentageSize) {
		var chk = new Checker("calculateWrapperSize");
		chk.isValidClass(puzzle,"puzzle",'Puzzle');		
		chk.isValid(elementArray,"elementArray");
		chk.checkNonEmptyArray(elementArray,"elementArray");
		chk.isValid(percentageSize,"percentageSize");
		
		var puzzleGridWrapper = puzzle.puzzleGridWrapper;
		var landscape = this.util.isLandscape();
		if(elementArray.includes(puzzleGridWrapper)){
			//do nothing.
		}else{
			elementArray.push(puzzleGridWrapper);
		}
		elementArray.forEach(function(element){
			if(landscape == true){
				var imgFormat = puzzle.imageObject.width / puzzle.imageObject.height;
				
				new Promise(function(resolve){
					$(element).css("height", percentageSize + '%');
					resolve();
				}).then(function(){
					var elemHeight = $(element).ready().height();
					$(element).css("width", elemHeight * imgFormat + "px");
				});
			}else{
				var imgFormat = puzzle.imageObject.height / puzzle.imageObject.width;
				
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
 }
 
 /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * END CLASS DEFINITION
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */	
 
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * I N T E R N A L - F U N C T I O N S
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
//set croppedImageDiv background to none
function restorePuzzle(croppedID){
    $(croppedID).css('background-image', 'none');
}



function cropImage(imageObject, sourceStartX, sourceStartY, cutWidth, cutHeight, imgWidth, imgHeight) {
   var canvasA = document.createElement('canvas');
   canvasA.width = imgWidth;
   canvasA.height = imgHeight;

	var context = canvasA.getContext('2d');
	//		      (Bildobjekt,   X Koordinate, Y Koordinate, Breite, Höhe , startin CanvasX, startin CanvasY, canvasbreite, canvashöhe)
	context.drawImage(imageObject, sourceStartX, sourceStartY, cutWidth, cutHeight, 0, 0, imgWidth, imgHeight);
	$('#croppedImageDiv').css({
		'background-image': 'url("'+ canvasA.toDataURL() + '")',
		"top": "-9999px",
		"bottom": "-9999px",
		"left": "-9999px",
		"right": "-9999px",
		"margin": "auto",
		"pointer-events": "none"
	});
 }
	/*tileCountWidth has been set to 12.
	It has been generated with the following formular:
	 * short side of a Nexus 6: 412 px as a minimum length;
	 * minimum length (412px) / minimum touchable width (32px)
	 * only the int value has been considered valid, because only complete tiles are necessary.
	*/
	function calculateTileSize(tileCount, setclassname){
		//TODO: zwischen ID und class unterscheiden
		var percentageTileSize = 1/tileCount * 100;
		$('.' + setclassname).css({
			"width" : percentageTileSize +'%', 
			"height" : percentageTileSize +'%',
			
		});
		
	}

//** Build the puzzle **/
                               
function buildPuzzleStructure(tileCount, appendToDOM, namespace, color, setclassname) {
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