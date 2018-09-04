

	function SingleAccess() {}
	
	SingleAccess.prototype.buildPuzzle = function (tileCount, appendToClass, color) {
	
		var puzzleBuilder = new PuzzleBuilder();
		
		puzzleBuilder.buildPuzzle(tileCount, appendToClass, color);
	};

	SingleAccess.prototype.createRangeSliders = function(questionCount,headers){

		var sliderFactory = new SliderFactory();
		return sliderFactory.createRangeSliders(questionCount,headers);
	};