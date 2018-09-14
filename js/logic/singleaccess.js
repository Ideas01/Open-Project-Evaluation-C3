

	function SingleAccess() {}
	
	SingleAccess.prototype.buildPuzzle = function (tileCount, appendToDOM, namespace, color, setclassname) {
	
		var puzzleBuilder = new PuzzleBuilder();
		puzzleBuilder.buildPuzzle(tileCount, appendToDOM, namespace, color, setclassname);
	};

    SingleAccess.prototype.buildPuzzleTiles = function (tileCount, appendToDOM, namespace, color, setclassname, clickedPuzzleTiles) {

        var puzzleBuilder = new PuzzleBuilder();
        puzzleBuilder.buildPuzzleTiles(tileCount, appendToDOM, namespace, color, setclassname,clickedPuzzleTiles);
    };

    SingleAccess.prototype.buildMiniOverview = function(image, div, appendToDOMOverview, namespaceOverview, classNameOverview, appendToDOMTiles, namespaceTiles, classNameTiles){
        var puzzleBuilder = new PuzzleBuilder();
        puzzleBuilder.buildMiniOverview(image, div, appendToDOMOverview, namespaceOverview, classNameOverview, appendToDOMTiles, namespaceTiles, classNameTiles);
	};

    SingleAccess.prototype.calculateWrapperSize = function (image, elementArray, percentageSize){
    	var puzzleBuilder = new PuzzleBuilder();
    	puzzleBuilder.calculateWrapperSize(image, elementArray, percentageSize);
	};

	SingleAccess.prototype.createRangeSliders = function(data){

		var sliderFactory = new SliderFactory();
		return sliderFactory.createRangeSliders(data.questions.length,data.questions);
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
