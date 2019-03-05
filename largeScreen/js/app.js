/*
 * app.js
 *
 * Required .js files
 *  - framework 7 .js files
 *  - singleaccess.js
 *  - puzzle.js
 * 
 * This is the main file using the "Framework 7" - framework.
 * It accesses the single access point.
 * 
 */
 
 
 /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  *  G L O B A L - V A R I A B L E S
  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
// Dom7
var $$ = Dom7; // instance necessary for Framework 7

//var puzzle_wrapper = '#puzzleWrapper'; // accessname for the puzzle wrapper 
var puzzle;
 /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  *  G L O B A L - F U N C T I O N S
  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  
// NONE
  
 /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  *  F R A M E W O R K     7
  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
// Framework7 App main instance
var app  = new Framework7({
    data: function (){
        return {
			currentContextIdIndex: null,
			currentPuzzleImageId: null,
			imageLoaded: false,
			highestScore: 0,
			lastActiveKey: null

        }
    },
  root: '#app', // App root element
  id: 'io.framework7.testapp', // App bundle ID
  name: 'Framework7', // App name
  theme: 'auto', // Automatic theme detection
  // App routes
  routes: routes,
});




 /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  *  F R A M E W O R K   7 - E V E N T S
  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  


$$(document).on('page:afterin','.page[data-name="puzzle"]', function(page){

	var singleAccess = new SingleAccess();
		singleAccess.checkGrid(puzzle.puzzleWrapper);
	});

$$(document).on('page:afterin','.page[data-name="prototype"]', function(page){
	
	setTimeout(function(){
		$(".arrow").addClass("fadeInOut");
	}, 1500);
		
});

app.on('pageInit', function(page){
	const deviceName = "OpenProjectEvalSlider";
	var singleAccess = new SingleAccess();
	var prototypeImagesKey = null;
	
	
	//console.log(page.name + " wird ausgeführt");
	
	function buildSwiperContent(callback){
		var counter = 0;
		var picturesPerChoice = 3;
		var selectionContent = {};
		

		singleAccess.waitForContexts(function(contextList){
			var XcontentArray = [];
			contextList.forEach(function(context, contextIndex, contextList){
			
				var imageURLs = contextList[contextIndex].images;
				counter = imageURLs.length;
				
				selectionContent = {
					aTitle:    '<h2 class ="prototypChoiceTitle">' + contextList[contextIndex].title + '</h2>',
					bContent:  '<article class= "descriptionPChoice">' + contextList[contextIndex].description + '</article>',
				};
				
				for(var i=0; i < picturesPerChoice; i++){
					if(counter > 0){
						selectionContent['c'+ i +'Image' + i] =   '<div class="selectionImgWrapper"> <img class="prototypeSelectionImg" src="' + imageURLs[i].url + '"/></div>';
						counter --;
					}
				}
			
				XcontentArray.push(selectionContent);
			});
			callback(XcontentArray);
			
		});
	}
	
	function resetPuzzleTiles(){	
		$(".puzzleWrapperpuzzlePieceDiv").each(function(index){
			var id = $(this).attr("id");
			document.getElementById(id).style.visibility = "visible";
		});
	}
	
	/***************************** prototypeSelection********************/
	
	if(page.name ==='prototypeSelection'){
		singleAccess.initializeDB(deviceName);
		singleAccess.resetCurrentContextId();
		singleAccess.initializeSwiper();
		
		singleAccess.getContexts(deviceName);

		buildSwiperContent(function(contentArray){
			 var mySwiper = singleAccess.buildSwiper(4, "prototypeSelectionSwiper", "pSelectionSwiper", "contentSwiper", contentArray);
		 });
		 
		 
		 $('#startSelectPrototype').click(function(){
			 var contextGeupdated = new Promise(function(resolve){
				 app.data.currentContextIdIndex = singleAccess.getCurrentContextIdIndex();
				 if(singleAccess.getCurrentContextIdIndex() >= 0){
					 singleAccess.waitForContexts(function(contextList){
						 //TODO: noch prüfen ob update erfolgreich.
						singleAccess.updateDeviceContext(contextList[singleAccess.getCurrentContextIdIndex()], deviceName);
						resolve(0);
					});
				 } else{
					let content = '<div class="block">' +
									'<p>'+
									'Bitte wähle einen Prototypen aus, der evaluiert werden soll.' +
									'</p>'+
									'<a href="#" class="popup-close" >' +
										'<a class="button popup-close"> OK </a>' +
									'</a>' +
								'</div>'
				 singleAccess.util_PopUp('BITTE AUSWÄHLEN',content);
				 };
			});	
			contextGeupdated.then(function(resolve){
				var idleTimeTimout;
				singleAccess.waitForContexts(function(contextList){
					singleAccess.subscribeToContext(deviceName, contextList[singleAccess.getCurrentContextIdIndex()], function(webSocket){
					
						webSocket.onmessage = function (event){
							//console.log(event.data);
							const data = JSON.parse(event.data)

							switch (data.type) {
								case 'init_success': {
								  console.log('init_success, the handshake is complete')
								  break
								}
								case 'init_fail': {
								  throw {
									message: 'init_fail returned from WebSocket server',
									data
								  }
								}
								case 'subscription_data': {
									
								
								
								var idleArray = [1];
								if(data.payload.data.contextUpdate.context.states == null){
									idleTimeTimout = setTimeout(function(){
										console.log("beginning idle time....")
										idleArray = ['puzzleWrapperpuzzlePiece|0022','puzzleWrapperpuzzlePiece|0132','puzzleWrapperpuzzlePiece|2002','puzzleWrapperpuzzlePiece|2113','puzzleWrapperpuzzlePiece|2223','puzzleWrapperpuzzlePiece|1233','puzzleWrapperpuzzlePiece|1202','puzzleWrapperpuzzlePiece|1112','puzzleWrapperpuzzlePiece|1012','puzzleWrapperpuzzlePiece|2110','puzzleWrapperpuzzlePiece|0113','puzzleWrapperpuzzlePiece|0212',
									'puzzleWrapperpuzzlePiece|0202','puzzleWrapperpuzzlePiece|0130','puzzleWrapperpuzzlePiece|1020','puzzleWrapperpuzzlePiece|1130','puzzleWrapperpuzzlePiece|1133','puzzleWrapperpuzzlePiece|2202','puzzleWrapperpuzzlePiece|1221','puzzleWrapperpuzzlePiece|1200','puzzleWrapperpuzzlePiece|0121','puzzleWrapperpuzzlePiece|0013','puzzleWrapperpuzzlePiece|0001','puzzleWrapperpuzzlePiece|0020','puzzleWrapperpuzzlePiece|1010','puzzleWrapperpuzzlePiece|1030','puzzleWrapperpuzzlePiece|2011','puzzleWrapperpuzzlePiece|2023','puzzleWrapperpuzzlePiece|2121','puzzleWrapperpuzzlePiece|2220','puzzleWrapperpuzzlePiece|2133','puzzleWrapperpuzzlePiece|1121','puzzleWrapperpuzzlePiece|1013','puzzleWrapperpuzzlePiece|1100','puzzleWrapperpuzzlePiece|1002','puzzleWrapperpuzzlePiece|0031','puzzleWrapperpuzzlePiece|0110','puzzleWrapperpuzzlePiece|0101','puzzleWrapperpuzzlePiece|0200','puzzleWrapperpuzzlePiece|0221','puzzleWrapperpuzzlePiece|0232','puzzleWrapperpuzzlePiece|0223','puzzleWrapperpuzzlePiece|1203']
										//'puzzleWrapperpuzzlePiece|1222','puzzleWrapperpuzzlePiece|1212','puzzleWrapperpuzzlePiece|1210','puzzleWrapperpuzzlePiece|1220','puzzleWrapperpuzzlePiece|1123','puzzleWrapperpuzzlePiece|1103','puzzleWrapperpuzzlePiece|1101','puzzleWrapperpuzzlePiece|1111','puzzleWrapperpuzzlePiece|1023','puzzleWrapperpuzzlePiece|1031','puzzleWrapperpuzzlePiece|1021','puzzleWrapperpuzzlePiece|1033','puzzleWrapperpuzzlePiece|2003','puzzleWrapperpuzzlePiece|1032','puzzleWrapperpuzzlePiece|2010','puzzleWrapperpuzzlePiece|2020','puzzleWrapperpuzzlePiece|2032','puzzleWrapperpuzzlePiece|2022','puzzleWrapperpuzzlePiece|2033','puzzleWrapperpuzzlePiece|2120','puzzleWrapperpuzzlePiece|2122','puzzleWrapperpuzzlePiece|2112','puzzleWrapperpuzzlePiece|2102','puzzleWrapperpuzzlePiece|2100','puzzleWrapperpuzzlePiece|1132','puzzleWrapperpuzzlePiece|1131','puzzleWrapperpuzzlePiece|2101','puzzleWrapperpuzzlePiece|2111','puzzleWrapperpuzzlePiece|1122','puzzleWrapperpuzzlePiece|1113','puzzleWrapperpuzzlePiece|1102','puzzleWrapperpuzzlePiece|0133','puzzleWrapperpuzzlePiece|0231','puzzleWrapperpuzzlePiece|0123','puzzleWrapperpuzzlePiece|0220','puzzleWrapperpuzzlePiece|0122','puzzleWrapperpuzzlePiece|0112','puzzleWrapperpuzzlePiece|0120','puzzleWrapperpuzzlePiece|0011','puzzleWrapperpuzzlePiece|0000','puzzleWrapperpuzzlePiece|0002','puzzleWrapperpuzzlePiece|0003','puzzleWrapperpuzzlePiece|0102']
										//,'puzzleWrapperpuzzlePiece|0210','puzzleWrapperpuzzlePiece|0203','puzzleWrapperpuzzlePiece|0222','puzzleWrapperpuzzlePiece|1213','puzzleWrapperpuzzlePiece|2201','puzzleWrapperpuzzlePiece|2211','puzzleWrapperpuzzlePiece|2222','puzzleWrapperpuzzlePiece|2231','puzzleWrapperpuzzlePiece|2232','puzzleWrapperpuzzlePiece|2233','puzzleWrapperpuzzlePiece|2203','puzzleWrapperpuzzlePiece|2103','puzzleWrapperpuzzlePiece|1230','puzzleWrapperpuzzlePiece|1231','puzzleWrapperpuzzlePiece|1201','puzzleWrapperpuzzlePiece|0033','puzzleWrapperpuzzlePiece|0032','puzzleWrapperpuzzlePiece|1000','puzzleWrapperpuzzlePiece|0030','puzzleWrapperpuzzlePiece|0021','puzzleWrapperpuzzlePiece|0010','puzzleWrapperpuzzlePiece|0012','puzzleWrapperpuzzlePiece|0023','puzzleWrapperpuzzlePiece|1001','puzzleWrapperpuzzlePiece|0233','puzzleWrapperpuzzlePiece|0213','puzzleWrapperpuzzlePiece|0201','puzzleWrapperpuzzlePiece|2001','puzzleWrapperpuzzlePiece|2130','puzzleWrapperpuzzlePiece|2123','puzzleWrapperpuzzlePiece|2212','puzzleWrapperpuzzlePiece|1223','puzzleWrapperpuzzlePiece|1232','puzzleWrapperpuzzlePiece|1211','puzzleWrapperpuzzlePiece|0230','puzzleWrapperpuzzlePiece|0111','puzzleWrapperpuzzlePiece|0100','puzzleWrapperpuzzlePiece|0103','puzzleWrapperpuzzlePiece|0211','puzzleWrapperpuzzlePiece|0131','puzzleWrapperpuzzlePiece|1003','puzzleWrapperpuzzlePiece|1120','puzzleWrapperpuzzlePiece|1022','puzzleWrapperpuzzlePiece|1011','puzzleWrapperpuzzlePiece|1110','puzzleWrapperpuzzlePiece|2012','puzzleWrapperpuzzlePiece|2013','puzzleWrapperpuzzlePiece|2021','puzzleWrapperpuzzlePiece|2031','puzzleWrapperpuzzlePiece|2030','puzzleWrapperpuzzlePiece|2000','puzzleWrapperpuzzlePiece|2131','puzzleWrapperpuzzlePiece|2230','puzzleWrapperpuzzlePiece|2221','puzzleWrapperpuzzlePiece|2210','puzzleWrapperpuzzlePiece|2213','puzzleWrapperpuzzlePiece|2132','puzzleWrapperpuzzlePiece|2200'];
											app.data.lastActiveKey = "idle";
											setImage(Math.floor(Math.random() * idlePictureURLs.data.length), true, function(loaded){
												resetPuzzleTiles();
												let hidePiecesFinished = singleAccess.hidePuzzlePieces(idleArray, false);
												hidePiecesFinished.then(function (result) {
													if(result === 0){
														setTimeout(function(){
															app.router.navigate('/highscore/');
														}, 60000);
														
													}
												});
											});
									}, 10000); //wait
								}else{
									if(typeof idleTimeTimout != 'undefined'){
										clearTimeout(idleTimeTimout);
									}
									singleAccess.hidePuzzlePieces(idleArray, true);
									var currentKey = data.payload.data.contextUpdate.context.states[0].key;
									console.log('subscription data has been received', data)
									var json =  data.payload.data.contextUpdate.context.states[0].value.replace(/'/g, '"');
									json = JSON.parse(json);
//									console.log("json", json);
									
									var puzzlePieceIdArray = data.payload.data.contextUpdate.context.states[0].value.split(",");
									var checkNumber = new RegExp("^[0-9]*$");
									
									if(checkNumber.test(json.imageId) == true){
										let key = data.payload.data.contextUpdate.context.states[0].key;
										console.log("found Number: ", puzzlePieceIdArray[0] );
										setImage(parseInt(json.imageId, 10),false, function(loaded){
											if(loaded){
												let lastActiveKey = app.data.lastActiveKey;
												if(currentKey === lastActiveKey){
													let hidePiecesFinished = singleAccess.hidePuzzlePiecesActivePuzzle(json.puzzleIDs);
												}else{
													resetPuzzleTiles();
													
													let hidePiecesFinished = singleAccess.hidePuzzlePiecesActivePuzzle(json.puzzleIDs);												
												}
												
											}
											app.data.lastActiveKey = currentKey;
										});
										
										if(json.chosenCategory != ''){
											
											singleAccess.waitForContexts(function (contextList) {
												singleAccess.getPuzzleImages(contextList[singleAccess.getCurrentContextIdIndex()], deviceName);
											});
											
											 singleAccess.waitForData("puzzleImages", deviceName, function (response) {
												 singleAccess.buildCategories("#guessItems", json.chosenCategory, json.imageId, response);
											 });
											
										}
										
										if(json.chosenAnswer != ''){
											$("#" + json.chosenAnswer).css("background-color", "black");
										}
										
										if(json.score != ''){
											
											if(app.data.highestScore < parseInt(json.score, 10) && json.chosenAnswerIScorrect){
												app.data.highestScore = parseInt(json.score, 10);
												console.log("aktueller Highscore: ", app.data.highestScore);
											}
											setTimeout(function(){
												app.router.navigate("/highscore/");
											}, 600);
											singleAccess.waitForContexts(function (contextList) {
												console.log("contextList", contextList)
												console.log("contextListid:", contextList[singleAccess.getCurrentContextIdIndex()]);
												
												singleAccess.deleteState(deviceName, key, contextList[singleAccess.getCurrentContextIdIndex()]);
											});
										}
										
									}else{
										//do nothing.
									}
										
										
										
										
										/* let hidePiecesFinished = singleAccess.hidePuzzlePieces(testArray);
										hidePiecesFinished.then(function (result) {
											if(result === 0){
												app.router.navigate('/highscore/');
											}
										}); */
										
									  break
									}
								}

								case 'subscription_success': {
								  console.log('subscription_success')
								  break
								}
								case 'subscription_fail': {
								  throw {
									message: 'subscription_fail returned from WebSocket server',
									data
								  }
								}
							  }
							}
						});
					});
					
					
				
				app.router.navigate('/puzzle/');
			});
		 });
		 
	} /***************** prototype Selection End ***********************/
	
	if(page.name === 'home'){
		// do nothing.	
	} /****************************** home end ****************************/

    /****************************** puzzle start ****************************/
 	if(page.name === 'puzzle') {
		console.log("pageInit puzzle")
		if(puzzle == undefined) // if theres no puzzle yet create a new one
			puzzle = new Puzzle(); // new puzzle 
        var imageSrc = null;

		singleAccess.waitForContexts(function(contextList){
			singleAccess.getPuzzleImages(contextList[singleAccess.getCurrentContextIdIndex()]); //fetch new Image from dbZugriff
		});
		
	}
	
	
	function setImage(imageID, idle, callback){
		var imagetype = "puzzleImages"; //default: active Puzzle Images
		
		if(idle){
			imagetype = "idlepuzzleImages";
		}
		
		singleAccess.waitForData(imagetype, deviceName, function(puzzleImagesArray){
		
			if(app.data.imageLoaded){
				console.log("Theres already an Image.");
				puzzle.imageObject.src = puzzleImagesArray[imageID].url
				$(puzzle.puzzleWrapper).css("background-image", 'url("' + puzzle.imageObject.src + '")');
				callback(true);
			}else{
				loadImage = new Promise(function (resolve, reject) {
					var backgroundImage = new Image();
					
					backgroundImage.src = puzzleImagesArray[imageID].url;
					app.data.currentPuzzleImageId = imageID;
					backgroundImage.crossOrigin = "Anonymous";
					backgroundImage.onload = function () {
						const originPictureWidth = backgroundImage.width;
						const originPictureHeight = backgroundImage.height;
						resolve(backgroundImage);
					};
					backgroundImage.onerror = function () {
						reject("could not load the image");
					};
				});
				
				loadImage.then(function(imageObject){
					puzzle.imageObject = imageObject;
					var wrapperArray = [puzzle.puzzleWrapper,'#croppedImageDiv'];
					singleAccess.buildPuzzleWithoutOverallGrid(puzzle.puzzleWrapper, puzzle, function(){
						singleAccess.calculateWrapperSize(puzzle, wrapperArray, 100);
						$(window).on('resize', function (page) {
							singleAccess.checkGrid(puzzle.puzzleWrapper);
							singleAccess.calculateWrapperSize(puzzle, wrapperArray, 100);
						});
						app.data.imageLoaded = true;
						$(puzzle.puzzleWrapper).css("background-image", 'url("' + puzzle.imageObject.src + '")');
						callback(true);
					});
				 });
				}
			

		});
	};
	
	/****************************** puzzle end ****************************/
	
	if(page.name === 'highscore') {
		$("#highscoreDiv").text(app.data.highestScore.toString());
		// setTimeout(function(){               //TODO: wieder reintun
				// app.data.imageLoaded = false;
			 // app.router.navigate('/puzzle/');
		// },5000);	
	}
		
		
});

	// Init/Create first view
	var homeView = app.views.create('#view-prototypeSelection', {
	  url: '/'
	});







