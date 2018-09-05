

	function SingleAccess() {}
	
	SingleAccess.prototype.buildPuzzle = function (tileCount, appendToClass, namespace, color, classname) {
	
		var puzzleBuilder = new PuzzleBuilder();
		
		puzzleBuilder.buildPuzzle(tileCount, appendToClass, namespace, color, classname);
	};

	SingleAccess.prototype.createRangeSliders = function(questionCount,headers){

		var sliderFactory = new SliderFactory();
		return sliderFactory.createRangeSliders(questionCount,headers);
	};