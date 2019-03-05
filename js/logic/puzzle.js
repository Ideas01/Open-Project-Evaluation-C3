/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * puzzle.js 
 * 
 * datacollection for puzzles
 * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
class Puzzle
{
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * C O N S T R U C T O R   &   A T T R I B U T E S
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
	constructor()
	{
		this.imageObject = undefined;
		this.color = "#ffb38f"; // default color
		this.overviewColor = "#ffb38f";
		this.bordercolor = "#ff9748";
		this.overallGridColor = "#d40055";
		this.overallGridSize = 4;
		this.tileCountPerGrid = 4;
		this.gridCount = 3;
		this.clickedPuzzleTiles = undefined;
		this.clickedPuzzleTiles = [];
		this.puzzleGridWrapper = "#puzzleGridWrapper";
		this.puzzleWrapper = '#puzzleWrapper';
		this.puzzlePointCounter = '#points'
		//this.pointCount = 144;
	}
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * F U N C T I O N S
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

	
	/**
	SetOverallGridSize()
	
	sets the overall grid size of this puzzle
	
	parameter:
	- value: (number) 
	*/
	SetOverallGridSize(value){
		var chk = new Checker("SetOverallGridSize");
		chk.isValidType(value, "value", 'number');
		this.overallGridSize = value;
		
	}
	
	/**
	GetTileCount()
	
	return
	- (number) amount of tiles the puzzle has in total
	*/
	GetTileCount()
	{
		var value = this.tileCountPerGrid * this.gridCount * this.tileCountPerGrid * this.gridCount ; 
		return value;
	}
	
	/**
	GetPoints()
	
	parameter:
	- factor: (number) - points for one tile
	
	return:
	- (number) : points 
	*/
	GetPoints(factor)
	{
		var chk = new Checker("SetOverallGridSize");
		chk.isValidType(factor, "factor", 'number');
		var value = (this.GetTileCount() - this.clickedPuzzleTiles.length) * factor;
		return value;
	}
	
}
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * E N D   C L A S S   D E F I N I T I O N 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */ 