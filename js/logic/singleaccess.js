

	function SingleAccess() {}
	
	SingleAccess.prototype.buildPuzzle = function (tileCount, appendToDOM, namespace, color, setclassname) {
	
		var puzzleBuilder = new PuzzleBuilder();
		
		puzzleBuilder.buildPuzzle(tileCount, appendToDOM, namespace, color, setclassname);
	};

	SingleAccess.prototype.createRangeSliders = function(questionCount,headers){

		var sliderFactory = new SliderFactory();
		return sliderFactory.createRangeSliders(questionCount,headers);
	};