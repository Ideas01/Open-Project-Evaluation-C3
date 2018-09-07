

	function SingleAccess() {}
	
	SingleAccess.prototype.buildPuzzle = function (tileCount, appendToDOM, namespace, color, setclassname) {
	
		var puzzleBuilder = new PuzzleBuilder();
		puzzleBuilder.buildPuzzle(tileCount, appendToDOM, namespace, color, setclassname);
	};

	SingleAccess.prototype.createRangeSliders = function(questionCount,headers){

		var sliderFactory = new SliderFactory();
		return sliderFactory.createRangeSliders(questionCount,headers);
	};
	
	SingleAccess.prototype.getToken = function(query){
		
		var dbZugriff = new DBZugriff();
		
		if(query != null){
			console.log("query leer")
			return dbZugriff.callDatabase(query);
		}else{
			console.log("query voll")
			return dbZugriff.getToken();
		}
	};
