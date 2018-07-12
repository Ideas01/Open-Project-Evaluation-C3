
$('document').ready(function () {
    var windowWidth = window.screen.width;
    var windowHeight = window.screen.height;


	/*tileCountWidth has been set to 12.
	It has been generated with the following formular:
	 * short side of a Nexus 6: 412 px as a minimum length;
	 * minimum length (412px) / minimum touchable width (32px)
	 * only the int value has been considered valid, because only complete tiles are necessary.
	*/
	function calculateTileSize(div, tileCount){		
		var picWidth= $(".puzzleDiv").width();
		var picHeight= $(".puzzleDiv").height();
		
		var picFormat = picWidth/ picHeight;
		
			
			var tile={
				width:picWidth / tileCount,
				height:picHeight / tileCount
			}		
		return tile;
		
	}

	var puzzleBuilder = new PuzzleBuilder();
    puzzleBuilder.buildPuzzle(12*12, calculateTileSize($(".puzzleDiv"), 12));
});