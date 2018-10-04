	function SingleAccess() {}
	
	const puzzleBuilder = new PuzzleBuilder();
	const sliderFactory = new SliderFactory();
	const dbZugriff = new DBZugriff('http://localhost:3000/');
	const swiperFactory = new SwiperFactory();
	const puzzleGuessBuilder = new PuzzleGuessBuilder();
	const util = new Util();
	/*************************************** PUZZLE *********************************/
	SingleAccess.prototype.buildPuzzle = function (wrapperDom, puzzle) {
		return puzzleBuilder.buildPuzzle(wrapperDom, puzzle);
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
	
    /*************************************** SLIDERS ******************************************************************/
	SingleAccess.prototype.determineRangeSliderAmount = function (startIndex, questionCount, rangeSliderObjects){
		return sliderFactory.determineRangeSliderAmount(startIndex, questionCount, rangeSliderObjects);
	};

	SingleAccess.prototype.setButtonCaption = function(remainingQuestions,buttonID){
		return sliderFactory.setButtonCaption(remainingQuestions,buttonID);
	}
     /************************************** puzzleGuessBuilder **************************************************/

    SingleAccess.prototype.buildCategories = function(puzzleImageID, puzzleImageData){
        puzzleGuessBuilder.buildCategories(puzzleImageID, puzzleImageData);
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
	
	SingleAccess.prototype.getGlobalContextList = function(){
		return dbZugriff.getGlobalContextList();
	};
		
	SingleAccess.prototype.waitForData = function(dataReference, deviceName, callback){
		dbZugriff.waitForData(dataReference, deviceName, callback);
	};
	
	SingleAccess.prototype.waitForContexts = function(callback){
		dbZugriff.waitForContexts(callback);
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

	/************************************** Utility ***********************************************************************/
	SingleAccess.prototype.util_PopUp = function(title, message, caption){
		util.popUp(title, message, caption);	
	}
	

	
