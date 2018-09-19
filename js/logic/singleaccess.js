

	function SingleAccess() {}
	
	const puzzleBuilder = new PuzzleBuilder();
	const sliderFactory = new SliderFactory();
	const dbZugriff = new DBZugriff();
	const swiperFactory = new SwiperFactory();

	/*************************************** PUZZLE *********************************/
	SingleAccess.prototype.buildPuzzle = function (imageObject, wrapperDom, puzzlePieceCount, color, clickedPuzzlePieces, overallGridSize) {
		puzzleBuilder.buildPuzzle(imageObject, wrapperDom, puzzlePieceCount, color, clickedPuzzlePieces, overallGridSize);
	};
	
	SingleAccess.prototype.buildPuzzleOld = function (tileCount, appendToDOM, namespace, color, setclassname) {
		puzzleBuilder.buildPuzzleOld(tileCount, appendToDOM, namespace, color, setclassname);
	};

    SingleAccess.prototype.buildPuzzleTiles = function (tileCount, appendToDOM, namespace, color, setclassname, clickedPuzzleTiles) {
        puzzleBuilder.buildPuzzleTiles(tileCount, appendToDOM, namespace, color, setclassname,clickedPuzzleTiles);
    };

    SingleAccess.prototype.buildMiniOverview = function(image, div, appendToDOMOverview, namespaceOverview, classNameOverview, appendToDOMTiles, namespaceTiles, classNameTiles){
        puzzleBuilder.buildMiniOverview(image, div, appendToDOMOverview, namespaceOverview, classNameOverview, appendToDOMTiles, namespaceTiles, classNameTiles);
	};

    SingleAccess.prototype.calculateWrapperSize = function (image, elementArray, percentageSize){
    	puzzleBuilder.calculateWrapperSize(image, elementArray, percentageSize);
	};

    /*************************************** SLIDERS ******************************************************************/
	SingleAccess.prototype.createRangeSliders = function(questionCount,headers){
		return sliderFactory.createRangeSliders(questionCount,headers);
	};

    /*************************************** DB Zugriff ***************************************************************/
	SingleAccess.prototype.initializeDB = function(deviceName){
		return dbZugriff.initializeDB(deviceName);
	};
	
	SingleAccess.prototype.getContexts = function(deviceName){
		return dbZugriff.getContexts(deviceName)
	}; 
	
	SingleAccess.prototype.getData = function(query, Token){
		return dbZugriff.getData(query, Token);
	};

    /*************************************** SwiperFactory ***************************************************************/
	 SingleAccess.prototype.initializeSwiper = function () {
		 return swiperFactory.initializeSwiper();
     };
	
	 SingleAccess.prototype.fillSwiper = function (imageArray) {
		return swiperFactory.fillSwiper(imageArray);
     };

	 SingleAccess.prototype.setHandler = function (swiper) {
		 return swiperFactory.setHandler(swiper);
     };