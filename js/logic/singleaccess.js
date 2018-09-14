

	function SingleAccess() {}
	
	const puzzleBuilder = new PuzzleBuilder();
	const sliderFactory = new SliderFactory();
	
	SingleAccess.prototype.buildPuzzle = function (imageObject, wrapperDom, puzzlePieceCount, color, clickedPuzzlePieces, overallGridSize) {
		puzzleBuilder.buildPuzzle(imageObject, wrapperDom, puzzlePieceCount, color, clickedPuzzlePieces, overallGridSize);
	};
	
	SingleAccess.prototype.buildPuzzleOld = function (tileCount, appendToDOM, namespace, color, setclassname) {
		puzzleBuilder.buildPuzzleOld(tileCount, appendToDOM, namespace, color, setclassname);
	};

    SingleAccess.prototype.buildPuzzleTiles = function (tileCount, appendToDOM, namespace, color, setclassname, clickedPuzzleTiles) {
        puzzleBuilder.buildPuzzleTiles(tileCount, appendToDOM, namespace, color, setclassname,clickedPuzzleTiles);
    };

    SingleAccess.prototype.buildMiniOverview = function(image, div, appendToDOMOverview, namespaceOverview, classNameOverview, appendToDOMTiles, namespaceTiles, classNameTiles){
        puzzleBuilder.buildMiniOverview(image, div, appendToDOMOverview, namespaceOverview, classNameOverview, appendToDOMTiles, namespaceTiles, classNameTiles);
	};

    SingleAccess.prototype.calculateWrapperSize = function (image, elementArray, percentageSize){
    	puzzleBuilder.calculateWrapperSize(image, elementArray, percentageSize);
	};

	SingleAccess.prototype.createRangeSliders = function(questionCount,headers){
		return sliderFactory.createRangeSliders(questionCount,headers);
	};
	
	SingleAccess.prototype.getToken = function(query){
		
		var dbZugriff = new DBZugriff();
		
		if(query != null){
			console.log("query voll");
			return dbZugriff.callDatabase(query);
		}else{
			console.log("query leer");
			return dbZugriff.getToken();
		}
	};
