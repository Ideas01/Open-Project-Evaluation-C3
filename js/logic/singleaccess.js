

	function SingleAccess() {}
	
	const puzzleBuilder = new PuzzleBuilder();
	const sliderFactory = new SliderFactory();
	const dbZugriff = new DBZugriff();
	const swiperFactory = new SwiperFactory();
	const choiceFactory = new ChoiceFactory();

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
	
	SingleAccess.prototype.getContexts = function(requiredResults, deviceName){
		return dbZugriff.getContexts(requiredResults, deviceName)
	}; 
	
	SingleAccess.prototype.updateDeviceContext = function(context, deviceName){
		dbZugriff.updateDeviceContext(context, deviceName);
	};
	
	SingleAccess.prototype.getPrototypeImages = function(contextID, deviceName){
		dbZugriff.getPrototypeImages(contextID, deviceName)
	};
	
	SingleAccess.prototype.getQuestions = function(context, deviceName){
		return dbZugriff.getQuestions(context, deviceName);
	};
	
	SingleAccess.prototype.getPuzzleImages = function(context, deviceName){
		return dbZugriff.getPuzzleImages(context, deviceName);
	};
	
	SingleAccess.prototype.sendEvalData = function(question, answer, deviceName){
		dbZugriff.sendEvalData(question, answer, deviceName);
	};
	
	
		
	SingleAccess.prototype.waitForData = function(dataReference, deviceName, callback){
		return dbZugriff.waitForData(dataReference, deviceName, callback);
	};
	
	SingleAccess.prototype.getGlobalContextList = function(){
		return dbZugriff.getGlobalContextList();
	};
	
	SingleAccess.prototype.getGlobalContextData = function(){
		return dbZugriff.getGlobalContextData();
	};
	
	
    /*************************************** SwiperFactory ***************************************************************/
	 SingleAccess.prototype.initializeSwiper = function () {
		 return swiperFactory.initializeSwiper();
     };
	
	 SingleAccess.prototype.buildSwiper = function (maxContentPerSwiper, nameSpace, type, contentArray) {
		return swiperFactory.buildSwiper(maxContentPerSwiper, nameSpace, type, contentArray);
     };

	 SingleAccess.prototype.setHandler = function (swiper) {
		 return swiperFactory.setHandler(swiper);
     };
	 
	 SingleAccess.prototype.fillSwiper = function(elementsArray, wrapperNameSpace){
		 swiperFactory.fillSwiper(elementsArray, wrapperNameSpace);
	 };
	 
	/************************************** choice Factory ****************************************************************/
	
	SingleAccess.prototype.buildPrototypeChoice = function (id,appendToSwiperId) {
        return choiceFactory.buildPrototypeChoice(id,appendToSwiperId);
    };
	
	
	/************************************** dianas SuccessSeite ***********************************************************/
	SingleAccess.prototype.buildConfetty = function(){
		Success.buildConfetty();
	};
