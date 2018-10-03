class Puzzle
{
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
		//this.pointCount = 144;
	}
	
	SetOverallGridSize(value){
		if(value!= "" && $.isNumeric(value)){
			this.overallGridSize = value;
		} else{
			//TODO exception werfen
			var errormsg = "Die gegebene gridSize ist keine Nummer";
			alert(errormsg);
		}
	}
	
	GetTileCount()
	{
		var value = this.tileCountPerGrid * this.gridCount * this.tileCountPerGrid * this.gridCount ; 
		console.log(">>> Anzahl Teile: " + value);
		return value;
	}
	
	GetPoints(factor)
	{
		var value = (this.GetTileCount() - this.clickedPuzzleTiles.length) * factor;
		console.log(">>> Anzahl Punkte: " + value);
		return value;
	}
	
}