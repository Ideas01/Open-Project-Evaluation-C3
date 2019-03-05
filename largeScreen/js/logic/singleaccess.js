	function SingleAccess() {}
	
	const puzzleBuilder = new PuzzleBuilder();
	const sliderFactory = new SliderFactory();
	const dbZugriff = new DBZugriff('http://192.168.43.174:3000'); //LAPTOP-U6MCNBIH
	const swiperFactory = new SwiperFactory();
	const puzzleGuessBuilder = new PuzzleGuessBuilder();
	const util = new Util();
	/*************************************** PUZZLE *********************************/
	SingleAccess.prototype.buildPuzzle = function (wrapperDom, puzzle) {
		return puzzleBuilder.buildPuzzle(wrapperDom, puzzle);
	};
	 
	SingleAccess.prototype.hidePuzzlePiecesActivePuzzle = function (puzzlePieceIdArray){
		return puzzleBuilder.hidePuzzlePiecesActivePuzzle(puzzlePieceIdArray);
	};
	
	SingleAccess.prototype.hidePuzzlePieces = function (puzzlePieceIdArray, stop){
		return puzzleBuilder.hidePuzzlePieces(puzzlePieceIdArray, stop);
	};
	
	SingleAccess.prototype.buildMiniOverview = function(appendToDOMOverview, puzzle){
        return puzzleBuilder.buildMiniOverview(appendToDOMOverview, puzzle);
	};

    SingleAccess.prototype.calculateWrapperSize = function (puzzle, elementArray, percentageSize){
    	puzzleBuilder.calculateWrapperSize(puzzle, elementArray, percentageSize);
	};

	SingleAccess.prototype.checkGrid = function (wrapperDom){
    	puzzleBuilder.checkGrid(wrapperDom);
	};

	SingleAccess.prototype.buildPuzzleWithoutOverallGrid = function(wrapperDom, puzzle, callback){
		puzzleBuilder.buildPuzzleWithoutOverallGrid(wrapperDom,puzzle, callback);
	};

	/*************************************** SLIDERS ******************************************************************/
	SingleAccess.prototype.determineRangeSliderAmount = function (startIndex, questionCount, rangeSliderObjects){
		return sliderFactory.determineRangeSliderAmount(startIndex, questionCount, rangeSliderObjects);
	};

	SingleAccess.prototype.setButtonCaption = function(remainingQuestions,buttonID){
		return sliderFactory.setButtonCaption(remainingQuestions,buttonID);
	};
	
	/************************************** puzzleGuessBuilder **************************************************/
    
    SingleAccess.prototype.appendCategories = function(DOMelement, imageCategories, callback) {
        puzzleGuessBuilder.appendCategories(DOMelement, imageCategories, callback) ;
    };
	
	 SingleAccess.prototype.checkGuessItem = function(givenAnswer, correctAnswer){
	 	puzzleGuessBuilder.checkGuessItem(givenAnswer, correctAnswer)
	};
	 
	 SingleAccess.prototype.buildCategories = function(DOMelement, clickedCategory, puzzleImageID, puzzleImageData, callback) {
        puzzleGuessBuilder.buildCategories(DOMelement, clickedCategory, puzzleImageID, puzzleImageData, callback);
    };
	
	/*************************************** DB Zugriff ***************************************************************/
	
	SingleAccess.prototype.initializeDB = function(deviceName){
		return dbZugriff.initializeDB(deviceName);
	};
	
	SingleAccess.prototype.getContexts = function(deviceName){
		return dbZugriff.getContexts(deviceName)
	}; 
	
	SingleAccess.prototype.updateDeviceContext = function(context, deviceName){
		dbZugriff.updateDeviceContext(context, deviceName);
	};
	
	SingleAccess.prototype.getPrototypeImages = function(context, deviceName){
		dbZugriff.getPrototypeImages(context, deviceName)
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
	
	SingleAccess.prototype.getGlobalContextList = function(){
		return dbZugriff.getGlobalContextList();
	};
		
	SingleAccess.prototype.waitForData = function(dataReference, deviceName, callback){
		dbZugriff.waitForData(dataReference, deviceName, callback);
	};
	
	SingleAccess.prototype.waitForContexts = function(callback){
		dbZugriff.waitForContexts(callback);
	};
	
	SingleAccess.prototype.subscribeToContext = function (devicename, context, callback){
		dbZugriff.subscribeToContext(devicename, context, callback);
	};
	
	SingleAccess.prototype.createState = function (deviceName, stateKey, stateValue, context, callback){
		dbZugriff.createState(deviceName, stateKey, stateValue, context, callback);
	};
	
	SingleAccess.prototype.getState = function (deviceName, stateKey, context){
		return dbZugriff.getState(deviceName, stateKey, context);
	}
	
	SingleAccess.prototype.deleteState = function (deviceName, key, context){
		return dbZugriff.deleteState(deviceName, key, context);
	};
	
	SingleAccess.prototype.deleteOldState = function (token, deviceName, key, context){
		return dbZugriff.deleteOldState(token, deviceName, key, context);
	};
	
	SingleAccess.prototype.updateState = function (deviceName, stateKey, stateValue, context){
		return dbZugriff.updateState(deviceName, stateKey, stateValue, context);
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
	 
	 SingleAccess.prototype.getCurrentContextIdIndex =function(){
		 return swiperFactory.getCurrentContextIdIndex();
	 };
	
	SingleAccess.prototype.resetCurrentContextId = function(){
		swiperFactory.resetCurrentContextId();
	};

	SingleAccess.prototype.setClickHandler = function(swiper, leftArrowId, rightArrowId){
		swiperFactory.setClickHandler(swiper, leftArrowId, rightArrowId);
    };

	/************************************** Utility ***********************************************************************/
	SingleAccess.prototype.util_PopUp = function(title, message, caption){
		util.popUp(title, message, caption);	
	};
	

	
