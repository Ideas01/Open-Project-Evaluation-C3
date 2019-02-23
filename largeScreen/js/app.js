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
			currentPuzzleImageId: null,
			loadImage: false
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
								  console.log('subscription data has been received', data)
									var json =  data.payload.data.contextUpdate.context.states[0].value.replace(/'/g, '"');
									json = JSON.parse(json);
									console.log("json", json);
									
									var puzzlePieceIdArray = data.payload.data.contextUpdate.context.states[0].value.split(",");
									console.log("imageid", puzzlePieceIdArray);
									var checkNumber = new RegExp("^[0-9]*$");
									
									if(checkNumber.test(json.imageId) == true){
										let key = data.payload.data.contextUpdate.context.states[0].key;
										console.log("found Number: ", puzzlePieceIdArray[0] );
										//TODO: NOCH PRÜFEN OB BILD SCHON DA. LÄDT GRAD ZU OFT
										setImage(parseInt(json.imageId, 10), function(loaded){
											if(loaded){
												let hidePiecesFinished = singleAccess.hidePuzzlePieces(json.puzzleIds);
											}
										});
										//singleAccess.deleteState(deviceName, key, contextList[singleAccess.getCurrentContextIdIndex()]);
									}else{
										//TODO: THROW EXCEPTION
									}
									
									
									
									
									/* let hidePiecesFinished = singleAccess.hidePuzzlePieces(testArray);
									hidePiecesFinished.then(function (result) {
										if(result === 0){
											app.router.navigate('/highscore/');
									    }
									}); */
									
								  break
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

		
 		//TODO:LÖSCHEN WENN ARRAY VON SUBSCRIPTIONS UMGESETZT WURDEN
 		var testArray = ['puzzleWrapperpuzzlePiece|0000', 'puzzleWrapperpuzzlePiece|0010', 'puzzleWrapperpuzzlePiece|2200'
		,'puzzleWrapperpuzzlePiece|2233'];

		singleAccess.waitForContexts(function(contextList){
			singleAccess.getPuzzleImages(contextList[singleAccess.getCurrentContextIdIndex()]); //fetch new Image from dbZugriff
		});
		
	}
	
	
	function setImage(imageID, callback){
		if(puzzle == undefined) // if theres no puzzle yet create a new one
			puzzle = new Puzzle(); // new puzzle 
        var imageSrc = null;
		
		singleAccess.waitForData("puzzleImages", deviceName, function(puzzleImagesArray){
		
			if(app.data.loadImage){
				console.log("Theres already an Image.")
			}else{
				loadImage = new Promise(function (resolve, reject) {
					var backgroundImage = new Image();
					
					backgroundImage.src = puzzleImagesArray[imageID].url;
					app.data.currentPuzzleImageId = imageID;
					
					//'https://i.ytimg.com/vi/HqzvqCmxK-E/maxresdefault.jpg';
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
				
				//TODO: nooooo dont build another puzzle if image already exists.
				singleAccess.buildPuzzleWithoutOverallGrid(puzzle.puzzleWrapper, puzzle);
				singleAccess.calculateWrapperSize(puzzle, wrapperArray, 100);
            	$(window).on('resize', function (page) {
					singleAccess.checkGrid(puzzle.puzzleWrapper);
					singleAccess.calculateWrapperSize(puzzle, wrapperArray, 100);
				});
				app.data.loadImage = true;
				callback(true);
			 });
			}
			
			$(puzzle.puzzleWrapper).css("background-image", 'url("' + puzzle.imageObject.src + '")');
			console.log(puzzle.imageObject);

		});
	};
	
		/****************************** puzzle end ****************************/

});

	// Init/Create first view
	var homeView = app.views.create('#view-prototypeSelection', {
	  url: '/'
	});







