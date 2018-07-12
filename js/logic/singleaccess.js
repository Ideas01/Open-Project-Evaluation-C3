

	function SingleAccess() {}
	
	SingleAccess.prototype.buildPuzzle = function (tileCount) {
	
		var puzzleBuilder = new PuzzleBuilder();
		
		puzzleBuilder.buildPuzzle(tileCount);
	}