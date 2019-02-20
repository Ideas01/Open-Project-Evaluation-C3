	function SingleAccess() {}
	
	const puzzleBuilder = new PuzzleBuilder();
	const dbZugriff = new DBZugriff('http://localhost:3000');
	const swiperFactory = new SwiperFactory();
	const util = new Util();
	/*************************************** PUZZLE *********************************/
	SingleAccess.prototype.buildPuzzle = function (wrapperDom, puzzle) {
		return puzzleBuilder.buildPuzzle(wrapperDom, puzzle);
	};
	 
	SingleAccess.prototype.hidePuzzlePieces = function (puzzlePieceIdArray)
	{
		return puzzleBuilder.hidePuzzlePieces(puzzlePieceIdArray);
	};

    SingleAccess.prototype.calculateWrapperSize = function (puzzle, elementArray, percentageSize){
    	puzzleBuilder.calculateWrapperSize(puzzle, elementArray, percentageSize);
	};

	SingleAccess.prototype.checkGrid = function (wrapperDom){
    	puzzleBuilder.checkGrid(wrapperDom);
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

	SingleAccess.prototype.getPuzzleImages = function(context, deviceName){
		return dbZugriff.getPuzzleImages(context, deviceName);
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
	
	SingleAccess.prototype.getPrototypeImages = function (context, deviceName){
		return dbZugriff.getPrototypeImages(context, deviceName);
	};
		
	SingleAccess.prototype.subscribeToContext = function (devicename, contextId){
		return dbZugriff.subscribeToContext(devicename, contextId);
	};
	
	SingleAccess.prototype.createState = function (deviceName, stateKey, stateValue, contextId){
		return dbZugriff.createState(deviceName, stateKey, stateValue, contextId);
	};
	
	SingleAccess.prototype.deleteState = function (deviceName, key, contextId){
		return dbZugriff.deleteState(deviceName, key, contextId);
	};
	
	SingleAccess.prototype.updateState = function (deviceName, stateKey, stateValue, contextId){
		return dbZugriff.updateState(deviceName, stateKey, stateValue, contextId);
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
	};
	

	
