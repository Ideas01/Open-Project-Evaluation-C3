

	function SingleAccess() {}
	
	SingleAccess.prototype.buildPuzzle = function (tileCount) {
	
		var puzzleBuilder = new PuzzleBuilder();
		
		puzzleBuilder.buildPuzzle(tileCount);
	};

	SingleAccess.prototype.createRangeSliders = function(questionCount,headers,){

		var sliderFactory = new SliderFactory();
		return sliderFactory.createRangeSliders(questionCount,headers);
	};