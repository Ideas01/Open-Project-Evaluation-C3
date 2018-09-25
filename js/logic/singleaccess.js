	function SingleAccess() {}
	
	const puzzleBuilder = new PuzzleBuilder();
	const sliderFactory = new SliderFactory();
	const dbZugriff = new DBZugriff();
	const swiperFactory = new SwiperFactory();
	const choiceFactory = new ChoiceFactory();
	const success = new Success();

	/*************************************** PUZZLE *********************************/
	SingleAccess.prototype.buildPuzzle = function (imageObject, wrapperDom, puzzlePieceCount, color, clickedPuzzlePieces, overallGridSize) {
		return puzzleBuilder.buildPuzzle(imageObject, wrapperDom, puzzlePieceCount, color, clickedPuzzlePieces, overallGridSize);
	};

    SingleAccess.prototype.buildMiniOverview = function(tileCountPerGrid, gridCount, clickedPuzzleTiles, image, appendToDOMOverview){
        return puzzleBuilder.buildMiniOverview(tileCountPerGrid, gridCount, clickedPuzzleTiles, image, appendToDOMOverview);
	};

    SingleAccess.prototype.calculateWrapperSize = function (image, elementArray, percentageSize){
    	puzzleBuilder.calculateWrapperSize(image, elementArray, percentageSize);
	};

    /*************************************** SLIDERS ******************************************************************/
	SingleAccess.prototype.determineRangeSliderAmount = function (startIndex, questionCount, rangeSliderObjects){
		return sliderFactory.determineRangeSliderAmount(startIndex, questionCount, rangeSliderObjects);
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
	
	 SingleAccess.prototype.buildSwiper = function (maxContentPerSwiper, swiperWrapperId, nameSpace, type, contentArray) {
		return swiperFactory.buildSwiper(maxContentPerSwiper, swiperWrapperId, nameSpace, type, contentArray);
     };

	 SingleAccess.prototype.setHandler = function (swiper) {
		 return swiperFactory.setHandler(swiper);
     };
	 
	/************************************** choice Factory ****************************************************************/
	
	SingleAccess.prototype.buildPrototypeChoice = function (id,appendToSwiperId) {
        return choiceFactory.buildPrototypeChoice(id,appendToSwiperId);
    };
	
	
	/************************************** dianas SuccessSeite ***********************************************************/
	SingleAccess.prototype.buildConfetty = function(){
		success.buildConfetty();
	};
