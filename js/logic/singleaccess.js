

	function SingleAccess() {}
	
	SingleAccess.prototype.buildPuzzle = function (tileCount, appendToClass, namespace, color, setclassname) {
	
		var puzzleBuilder = new PuzzleBuilder();
		
		puzzleBuilder.buildPuzzle(tileCount, appendToClass, namespace, color, setclassname);
	};

	SingleAccess.prototype.createRangeSliders = function(questionCount,headers){

		var sliderFactory = new SliderFactory();
		return sliderFactory.createRangeSliders(questionCount,headers);
	};