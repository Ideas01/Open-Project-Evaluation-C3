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
			stateCreated: false,
			puzzlekey: "puzzle",
			stateValues: {},
			currentScore: null,
			deviceId: ""
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


$$(document).on('page:afterin', '.page[data-name="puzzle"]', function (page) {

    var singleAccess = new SingleAccess();
    singleAccess.checkGrid(puzzle.puzzleWrapper);
    let content = '<div class="block">' +
        '<p> Vielen Dank für deine Teilnahme an dieser Umfrage. <br/>' +
        'Als kleines Dankeschön kannst du auf dieser Seite ein Ratespiel lösen. <br/>' +
        'Die Regeln sind ganz einfach: <br/><br/>' +
        'Ziel des Spiels ist es, das Bild unter den Teilen zu erraten. <br/>' +
        'Für jedes aufgedeckte Teil werden dir von den Punkten links oben Punkte abgezogen.' +
        ' Also versuche möglichst wenige Teile aufzudecken, um das Ratespiel zu lösen und den Highscore zu knacken.<br/><br/>' +
        'Viel Erfolg und viel Spaß dabei. <br/><br/>' +
        '</p>' +
        '<a href="#" class="popup-close" >' +
        '<a class="button popup-close"> Los geht´s! </a>' +
        '</a>' +
        '</div>';
    singleAccess.util_PopUp('Spielanleitung', content);

});

$$(document).on('page:afterin','.page[data-name="prototype"]', function(page){
	
	setTimeout(function(){
		$(".arrow").addClass("fadeInOut");
	}, 1500);
		
});
	 

app.on('pageInit', function(page){

	const deviceName = "OpenProjectEvalSlider";
	var singleAccess = new SingleAccess();
	singleAccess.initializeDB(deviceName, function(deviceid){
		app.data.deviceId = deviceid;
	});
	
	var prototypeImagesKey = null;
	
	function buildSwiperContent(callback){
		var counter = 0;
		var picturesPerChoice = 3;
		var selectionContent = {};

		singleAccess.waitForContexts(function(contextList){
			var XcontentArray = [];
		    
		   var lastDeviceId = localStorage.getItem("lastdeviceId");
	    	var stateCreated = localStorage.getItem("stateCreated");
	    	var lastContextId = localStorage.getItem("lastContextId");
	    	var oldDeviceToken = localStorage.getItem("oldDeviceToken");
	    	
	   	console.log("lastDeviceId = " + lastDeviceId + " \n stateCreated = " + stateCreated + " \n lastContextId = " +  lastContextId + "oldDeviceToken" +oldDeviceToken);
			if(lastDeviceId !="" && stateCreated == "true" && lastContextId != null){
				singleAccess.deleteOldState(oldDeviceToken, deviceName, "puzzle_" + lastDeviceId, contextList[parseInt(lastContextId)], function(result){
					if(result){
						console.log("state wurde gelöscht", response);
					}else{
						console.log("state konnte nicht gelöscht werden. Grund: ", result);
					}
				
				});
			}
	
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
	
	function danksagungStarten(){
		var waiting = setInterval(function(){
			$('#danksagungSlider').html('Vielen Dank für deine Bewertung! Du wirst nun zum Ratespiel weitergeleitet.');
			$('#waitingMarks').show();
		},2000); //delay is in milliseconds 

		setTimeout(function(){
			 clearInterval(waiting);			 //clear above interval after 15 seconds
			 app.router.navigate('/puzzle/')
		},4000);
	}
	
	function waitForResponse(){
		$('#danksagungSlider').html('Bewertung wird gesendet.');
		$('#waitingMarks').show();
		let scrollTo = document.getElementById("danksagungSlider");
		scrollTo.scrollIntoView({
			behavior : 'smooth'
		});
		var waitingforResponse = setInterval(function(){
			singleAccess.waitForData("evalData", deviceName, function(response){
				if(response == false){
				}else{
					clearInterval(waitingforResponse);
					danksagungStarten();
				}
			});
		}, 1000);
		
		setTimeout(function(){
			 clearInterval(waitingforResponse);			 //clear above interval after 15 seconds
			 $('#danksagungSlider').html('Bewertung konnte nicht gesendet werden. Bitte überprüfen Sie die Internetverbindung und versuchen es erneut.');
			 $('#waitingMarks').hide();
			 $('#repeatSendEvalData').show();
			 
		}, 60000);
	}
	
	/***************************** prototypeSelection********************/
	
	if(page.name ==='prototypeSelection'){
		
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
						singleAccess.getPuzzleImages(contextList[singleAccess.getCurrentContextIdIndex()]);
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
				app.router.navigate('/home/');
			}); 				
		 });
		
	

		 
	
		
		/* //Testarray für mehr Inhalt
		contentArray = [{
			title:    '<h2 class ="prototypChoiceTitle"> title1 </h2>',
			content:  '<article class= "descriptionPChoice">Weit hinten, hinter den Wortbergen, fern der Länder Vokalien und Konsonantien leben die Blindtexte. Abgeschieden wohnen sie in Buchstabhausen an der Küste des Semantik, eines großen Sprachozeans.</article>',
			image1:	  '<div class="selectionImgWrapper"><img class="prototypeSelectionImg" src=" img/examples/PrototypBsp1.png "/></div>',
			image2:   '<div class="selectionImgWrapper"><img class="prototypeSelectionImg" src=" img/examples/PrototypBsp2.png "/></div>',
		},{
			title:    '<h2 class ="prototypChoiceTitle"> title2 </h2>',
			content:  '<article class= "descriptionPChoice">Weit hinten, hinter den Wortbergen, fern der Länder Vokalien und Konsonantien leben die Blindtexte. Abgeschieden wohnen sie in Buchstabhausen an der Küste des Semantik, eines großen Sprachozeans.</article>',
					image1:	  '<div class="selectionImgWrapper"><img class="prototypeSelectionImg" src=" img/examples/PrototypBsp1.png "/></div>',
			image2:   '<div class="selectionImgWrapper"><img class="prototypeSelectionImg" src=" img/examples/PrototypBsp2.png "/></div>',
		} ,{
			title:    '<h2 class ="prototypChoiceTitle"> title3 </h2>',
			content:  '<article class= "descriptionPChoice">Weit hinten, hinter den Wortbergen, fern der Länder Vokalien und Konsonantien leben die Blindtexte. Abgeschieden wohnen sie in Buchstabhausen an der Küste des Semantik, eines großen Sprachozeans.</article>',
					image1:	  '<div class="selectionImgWrapper"><img class="prototypeSelectionImg" src=" img/examples/PrototypBsp1.png "/></div>',
			image2:   '<div class="selectionImgWrapper"><img class="prototypeSelectionImg" src=" img/examples/PrototypBsp2.png "/></div>',
		},{
			title:    '<h2 class ="prototypChoiceTitle"> title 4 </h2>',
			content:  '<article class= "descriptionPChoice">Weit hinten, hinter den Wortbergen, fern der Länder Vokalien und Konsonantien leben die Blindtexte. Abgeschieden wohnen sie in Buchstabhausen an der Küste des Semantik, eines großen Sprachozeans.</article>',
			image1:	  '<img class="prototypeSelectionImg" src="'+ +'" />',
			image2:   '<img class="prototypeSelectionImg" src="'+ +'"/>'
		},{
			title:    '<h2 class ="prototypChoiceTitle"> title 5 </h2>',
			content:  '<article class= "descriptionPChoice">Weit hinten, hinter den Wortbergen, fern der Länder Vokalien und Konsonantien leben die Blindtexte. Abgeschieden wohnen sie in Buchstabhausen an der Küste des Semantik, eines großen Sprachozeans.</article>',
			image1:	  '<img class="prototypeSelectionImg" src="'+ +'" />',
			image2:   '<img class="prototypeSelectionImg" src="'+ +'"/>'
		},{
			title:    '<h2 class ="prototypChoiceTitle"> title 6 </h2>',
			content:  '<article class= "descriptionPChoice">Weit hinten, hinter den Wortbergen, fern der Länder Vokalien und Konsonantien leben die Blindtexte. Abgeschieden wohnen sie in Buchstabhausen an der Küste des Semantik, eines großen Sprachozeans.</article>',
			image1:	  '<img class="prototypeSelectionImg" src="'+ +'" />',
			image2:   '<img class="prototypeSelectionImg" src="'+ +'"/>'
		} ]; */

	} /***************** prototype Selection End ***********************/
	
	if(page.name === 'home'){
	
		singleAccess.waitForContexts(function(contextList){
			
			singleAccess.getPuzzleImages(contextList[singleAccess.getCurrentContextIdIndex()]);
			singleAccess.waitForData("puzzleImages", deviceName, function(puzzleImagesArray){
				let randomImageId = Math.floor(Math.random() * Math.floor(puzzleImagesArray.length));
				app.data.currentPuzzleImageId = randomImageId;
			});
		});
	} /****************************** home end ****************************/

	/****************************** P2 Start ***************************/
    if (page.name === 'prototype'){
        var imageArray = ["img/examples/PrototypBsp1.png", "img/examples/PrototypBsp2.png", "img/examples/PrototypBsp3.png"];
        singleAccess.initializeSwiper();
		
		//TODO aktuellen ContextIndex übergeben
		singleAccess.waitForContexts(function(contextList){
			singleAccess.getPrototypeImages(contextList[singleAccess.getCurrentContextIdIndex()], deviceName);
		});
		
		new Promise(function(resolve, reject){
			singleAccess.waitForData("prototypeImages", deviceName, function(prototypeImages){
				imageArray = [];				
				prototypeImages.forEach(function(image, imageIndex, prototypeImages){
					imageArray.push(prototypeImages[imageIndex].url);
					});
				resolve(imageArray);
			});
		
		}).then(function(imageArray){
			let prototypeSwiper = document.querySelector('#prototypeSwiper').swiper;
            //imageArray = ["img/examples/PrototypBsp1.png", "img/examples/PrototypBsp2.png", "img/examples/PrototypBsp3.png"];
			mySwiper = singleAccess.buildSwiper(1, "prototypeSwiper", "prototypeSwiperInner", "imageSwiper", imageArray);

			singleAccess.setHandler(mySwiper);

			$(document).ready(function () {
				singleAccess.setClickHandler(mySwiper,"#leftArrow", "#rightArrow");
            });
		});
		$(".arrow").removeClass("fadeInOut");

        $(".help").click(function () {
            let content = '<div class="block">' +
                '<p>Du betrachtest gerade den Prototyp. Durch wischen nach rechts oder links kannst du' +
                ' zwischen den Bildern des Prototyp wechseln. Alternativ kannst du auch die Pfeile am Rand des Bildschirms dafür benutzen.' +
                ' Hast du alle Bilder betrachtet, kannst du dich zur Bewertung weiterleiten lassen.<img src="img/swipe.png"/></p>' +
                '<a href="#" class="popup-close" >' +
                '<a class="button popup-close"> Los geht´s! </a>' +
                '</a>' +
                '</div>';
            singleAccess.util_PopUp('HILFE', content);
        });
    }
    /****************************** P2 end ****************************/


    /****************************** sliders start *********************/
    if (page.name === 'sliders') {
		var questions = {};
		var sliderValues = [];
		
        $('#sendRatingsButton').hide();
        app.popup.close();
        singleAccess.waitForContexts(function (contextList) {
            singleAccess.getQuestions(contextList[singleAccess.getCurrentContextIdIndex()], deviceName);
        });
        singleAccess.waitForData("questions", deviceName, function (response) {
			questions = response;
          //index where to start in the questions
            var currentIndex = 0;

            //to check if there are any questions left
            var remainingQuestions = response.length;
			singleAccess.setButtonCaption(remainingQuestions,'sendRatingsButton');
            //initialize the sliders, starting with the data at startIndex
            try {
                var rangeSliderReferences = singleAccess.determineRangeSliderAmount(currentIndex, remainingQuestions, response);
                $('#sendRatingsButton').show();
            } catch (e) {
                if (e instanceof RangeError) {
                    console.log(e.message);
                }
            }

            //raise the index, so we know at which point to access the data
            currentIndex += rangeSliderReferences.length;
            
			//when the button is clicked
            $("#sendRatingsButton").click(function () {

                //subtract the amount of initialized rangeSliders, so we know how many questions are left
                remainingQuestions -= rangeSliderReferences.length;
				singleAccess.setButtonCaption(remainingQuestions,'sendRatingsButton');
				
                //if there are questions left..
                if (remainingQuestions > 0) {
                    //array for saving the values of the sliders

                    //...save slider values of the existing sliders
                    for (var i = 0; i < rangeSliderReferences.length; i++) {
                        sliderValues.push({
                            id: rangeSliderReferences[i].questionId,
                            value: rangeSliderReferences[i].value + rangeSliderReferences[i].min
                        });
                    }

                    //initialize the sliders, starting with data at startIndex
                    try {
                        rangeSliderReferences = singleAccess.determineRangeSliderAmount(currentIndex, remainingQuestions,
                            response);
                    } catch (e) {
                        if (e instanceof RangeError) {
                            console.log(e.message);
                        }
                    }
                    //raise the index, so we know at which point to access the data
                    currentIndex += rangeSliderReferences.length;
                }
                //no more questions to display
               else {
				   singleAccess.setButtonCaption(remainingQuestions,'sendRatingsButton');
				   waitForResponse();
					//array for saving the values of the sliders
					//save slider values of the existing sliders
					for (var i = 0; i < rangeSliderReferences.length; i++) {
						sliderValues.push({
							id: rangeSliderReferences[i].questionId,
							value: rangeSliderReferences[i].value + rangeSliderReferences[i].min
						});
					}
					
                    //save slider values of the existing sliders
                    for (var i = 0; i < questions.length; i++) {    
						singleAccess.sendEvalData(questions[sliderValues[i].id].id, sliderValues[i].value, deviceName);
                    }

                }
            });
			
			
			
			$('#repeatSendEvalData').click(function(){
				waitForResponse();
				$('#repeatSendEvalData').hide();
			});
			
        });


        $(".help-sliders").click(function () {
            let content = '<div class="block">' +
                '<p>Auf dieser Seite kannst du den Prototypen bewerten. <br/> Lies dir dafür die Fragen durch' +
                ' und beantworte sie, indem du die Slider in die deiner Meinung entsprechende Richtung ziehst. <br/>' +
                ' Sobald du fertig bist, kannst du deine Bewertung abschicken. Anschließend wirst du zum Ratespiel' +
                ' weitergeleitet.' +
                '</p>' +
                '<a href="#" class="popup-close" >' +
                '<a class="button popup-close"> Los geht´s! </a>' +
                '</a>' +
                '</div>';
            singleAccess.util_PopUp('HILFE', content);
        });
    }
    /****************************** sliders end ****************************/



    /****************************** puzzle start ****************************/
 	if(page.name === 'puzzle') {
		if(puzzle == undefined){
			puzzle = new Puzzle(); // new puzzle 
		}
		var imageSrc = null;
		app.data.puzzlekey = "puzzle";
		var keyString = "imageId";
		var puzzleIDs = "puzzleIDs";
		var chosenCategory = "chosenCategory";
		var chosenAnswer = "chosenAnswer";
		var score = "score";
		var currentContextId = singleAccess.getCurrentContextIdIndex();
		var chosenAnswerIScorrect = "chosenAnswerIScorrect";
		
		
		singleAccess.waitForContexts(function(contextList){
			
//			var stateValue = "'" + keyString + "':'" + app.data.currentPuzzleImageId +  "', 'puzzleIds': []";
			
			app.data.stateValues[keyString] = app.data.currentPuzzleImageId;
			app.data.stateValues[puzzleIDs] = [];
			app.data.stateValues[chosenCategory] = "";
			app.data.stateValues[chosenAnswer] = "";
			app.data.stateValues[score] = "";
			app.data.stateValues[chosenAnswerIScorrect] = "";
			
			var stateValues = app.data.stateValues;

			stateValue = (JSON.stringify(stateValues)).replace(/"/g, "'");
			
//			app.data.stateValues[0] = stateValue;
			
			singleAccess.createState(deviceName, app.data.puzzlekey, stateValue , contextList[singleAccess.getCurrentContextIdIndex()], function(createdState){
				console.log("createdState", createdState);
				app.data.stateCreated = true;
				
				if (typeof(Storage) !== "undefined") {
				  // Code for localStorage/sessionStorage.
				  localStorage.setItem("lastdeviceId", (app.data.deviceId).toString());
				  localStorage.setItem("stateCreated", (app.data.stateCreated).toString());
				  localStorage.setItem("lastContextId", singleAccess.getCurrentContextIdIndex().toString());
				  
				} else {
				  console.log("Sorry! No Web Storage support..");
				}
				
				console.log("state: ", app.data.stateCreated);
					if (createdState.data == null){
						//TODO: THROW EXCEPTION
					}
			});
		});
		
		singleAccess.waitForData("puzzleImages", deviceName, function(puzzleImagesArray){

			var loadImage = new Promise(function (resolve, reject) {
			var backgroundImage = new Image();
			backgroundImage.src = puzzleImagesArray[app.data.currentPuzzleImageId].url;

			
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
			$(puzzle.puzzleWrapper).css("background-image", 'url("' + imageObject.src + '")');
			singleAccess.buildPuzzle(puzzle.puzzleWrapper, puzzle);
			singleAccess.calculateWrapperSize(puzzle, wrapperArray, 100);
				
			$(window).on('resize', function (page) {
				singleAccess.checkGrid(puzzle.puzzleWrapper);
				singleAccess.calculateWrapperSize(puzzle, wrapperArray, 100);
			});
		}).then(function(){
				var puzzlePieceClassName = $(puzzle.puzzleWrapper).find("div").last().attr("class");
				var updatedStateValue;
				 
				$('.' + puzzlePieceClassName).click(function (event) {
					var puzzlePieceID = event.target.id;
					event.target.style.visibility = "hidden";
					
					singleAccess.waitForContexts(function(contextList){
						if(app.data.stateCreated == false){
							console.log("state does not exist yet.");
						} else{						
							app.data.stateValues.puzzleIDs.push(puzzlePieceID);
							app.data.currentScore = $("#points").text();
							app.data.imageId = app.data.currentPuzzleImageId;
							updatedStateValue = JSON.stringify(app.data.stateValues).replace(/"/g, "'");
							
							singleAccess.updateState(deviceName, app.data.puzzlekey, updatedStateValue, contextList[singleAccess.getCurrentContextIdIndex()]);
						}
						
					});
					
				});
			});
		});


        $("#helpPuzzle").click(function () {
            let content = '<div class="block">' +
                '<p>Das zu erratene Bild ist unter den farbigen Flächen versteckt. Drücke auf eine Fläche,' +
                ' um sie verschwinden zu lassen. <br/> Aber Vorsicht: Für jede Fläche wird dir ein Punkt abgezogen' +
                ' und deine Chance den Highscore zu knacken sinkt!<br/> Sobald du das Bild erraten' +
                ' willst, drücke den Button unter dem Bild.<br/><br/> Viel Spaß!</p>' +
                '<a href="#" class="popup-close" >' +
                '<a class="button popup-close"> Los geht´s! </a>' +
                '</a>' +
                '</div>';
            singleAccess.util_PopUp('HILFE', content);
        });
    }
	
	/****************************** puzzle end ****************************/
	
	/*************************** puzzleGuess start ************************/
    if (page.name === 'puzzleGuess') {
    	var wrapperArray = ['#puzzleOverview'];
		var puzzleImageID = app.data.currentPuzzleImageId;

        singleAccess.waitForContexts(function (contextList) {
            singleAccess.getPuzzleImages(contextList[app.data.currentContextIdIndex], deviceName);
        });
        new Promise(function (resolve,reject) {
            singleAccess.waitForData("puzzleImages", deviceName, function (response) {
                
				singleAccess.appendCategories('#guessOverview', response, function(){
					$('#guessOverview').children().click(function (event) {
						 
						var key = app.data.puzzlekey;
						var keyString = "userGuessCategory";
						var updatedStateValue;
						var clickedCategory = event.target.id;
						singleAccess.waitForContexts(function(contextList){

							singleAccess.buildCategories('#guessItems', event.target.id, puzzleImageID, response, function(puzzleImageData){
								if(app.data.stateCreated == false){
									console.log("state does not exist yet.");
								} else{						
									app.data.stateValues.chosenCategory = clickedCategory;
									updatedStateValue = JSON.stringify(app.data.stateValues).replace(/"/g, "'");
		//									console.log("updatedStateValue puzzle", updatedStateValue);
									
									singleAccess.updateState(deviceName, key, updatedStateValue, contextList[singleAccess.getCurrentContextIdIndex()]);
								}
									
								for (var i = 0; i < puzzleImageData.length - 1; i++) {
									if (puzzleImageData[i].category === clickedCategory) {
										$.each(puzzleImageData[i].wrongAnswers, function (index, data) {
	//											console.log("puzzleImageData: ", data);
											
											$('#' + data).click(function (chosenElement) {
												app.data.stateValues.chosenAnswer = chosenElement.target.id;
												app.data.stateValues.score = app.data.currentScore;
												//var updatedChosenAnswer = JSON.stringify(app.data.stateValues).replace(/"/g, "'");
												//singleAccess.updateState(deviceName, key, updatedChosenAnswer, contextList[singleAccess.getCurrentContextIdIndex()]);
												
	//												console.log("correctAnswer: ", puzzleImageData.correctCategory.correctAnswer);
												singleAccess.checkGuessItem( chosenElement.target.id, puzzleImageData.correctCategory.correctAnswer);
												
												if(puzzleImageData.correctCategory.correctAnswer == chosenElement.target.id){
													console.log("chosenAnswer is correct")
													app.data.stateValues.chosenAnswerIScorrect = true;
													let updatedChosenAnswer = JSON.stringify(app.data.stateValues).replace(/"/g, "'");
													singleAccess.updateState(deviceName, key, updatedChosenAnswer, contextList[singleAccess.getCurrentContextIdIndex()]);
												}else{
													console.log("chosenAnswer is false")
													app.data.stateValues.chosenAnswerIScorrect = false;
													let updatedChosenAnswer = JSON.stringify(app.data.stateValues).replace(/"/g, "'");
													singleAccess.updateState(deviceName, key, updatedChosenAnswer, contextList[singleAccess.getCurrentContextIdIndex()]);
												}
											});

										});
									}
								}
							});
					    });

					});
                
                
                //singleAccess.buildCategories(puzzleImageID,response);

                var backgroundImage = new Image();
                backgroundImage.src = response[puzzleImageID].url;
                backgroundImage.onload = function () {
                    resolve(backgroundImage);
                };
                backgroundImage.onerror = function () {
                    reject("could not load the image");
                };
            });
            });
        }).then(function (backgroundImage) {
            singleAccess.buildMiniOverview('#puzzleOverview', puzzle);
        });
		
		$(window).on('resize', function (page) {
			singleAccess.calculateWrapperSize(puzzle, wrapperArray, 60);
		});
		
		$("#helpPuzzleGuess").click(function () {
			let content = 	'<div class="block">' +
								'<p> Auf dieser Seite kannst du erraten, was unter dem zuvor verdeckten Bild zu sehen ist. <br/>'+
								'Wähle dazu im oberen Bereich zunächst die Kategorie aus, zu der der Bildinhalt passt '+
								'und wähle darunter die Lösung, die du für richtig hälst. <br/><br/>'+
								'Noch ein Tipp: <br/>'+
								'Falls du in der gewählten Kategorie nicht den gewünschten Begriff finden kannst, geh '+
								'besser noch einmal eine Seite zurück und decke mehr Teile auf. <br/>'+ 
								'Viel Erfolg! <br/><br/>'+
								'</p>' +
								'<a href="#" class="popup-close" >' +
									'<a class="button popup-close"> Los geht´s! </a>' +
								'</a>' +
							'</div>';
			singleAccess.util_PopUp('HILFE',content);	
        });
        
		    $('#guessOverview').children().click(function (event) {
		    	
		    	var key = app.data.puzzlekey;
				var keyString = "userGuessCategory";
		 		var updatedStateValue;
		 		var chosenElement = event.target.id;
		 		console.log("##################### chosen",chosenElement)
		 		singleAccess.waitForContexts(function(contextList){
					if(app.data.stateCreated == false){
						console.log("state does not exist yet.")
					} else{					
						app.data.stateValues.chosenAnswer = chosenElement;
						updatedStateValue = JSON.stringify(app.data.stateValues).replace(/"/g, "'");
							
							singleAccess.updateState(deviceName, key, updatedStateValue, contextList[singleAccess.getCurrentContextIdIndex()])
					}
		     });
		    })
    }

    /****************************** puzzleGuess end ****************************/

	if(page.name === 'success'){
        $('#pointDivSuccess').text("DU HAST: " + puzzle.GetPoints(1) + " PUNKTE!");
		puzzle = new Puzzle(); // (resetting the puzzle  - after returning the points)
		var counter = 15;
		var autoRedirectToHome = setInterval(function(){
			$('.redirectIn').html(counter);
			counter--;
		},1000); //delay is in milliseconds 

		setTimeout(function(){
			 clearInterval(autoRedirectToHome);			 //clear above interval after 15 seconds
			 app.router.navigate('/home/')
		},16000);
	}
	
	if(page.name === 'failure'){
		var puzzleImageID = app.data.currentPuzzleImageId;
		new Promise(function (resolve,reject) {
			
			var backgroundImage = new Image();
			singleAccess.waitForData("puzzleImages", deviceName, function (response) {
				backgroundImage.src = response[puzzleImageID].url;
				backgroundImage.onload = function () {
					resolve(backgroundImage);
				};
				backgroundImage.onerror = function () {
					reject("could not load the image");
				};
			});
		}).then(function(backgroundImage){
			var imgFormat = puzzle.imageObject.width / puzzle.imageObject.height;
			console.log("imgFormat" + imgFormat);
			$("#correctImg").css("background-image","url(" + backgroundImage.src + ")");
			$("#correctImg").css("width", $("#correctImg").ready().height() * imgFormat + "px");
			 
			 puzzle = new Puzzle(); // new puzzle 
			var counter = 15;
			var autoRedirectToHome = setInterval(function(){
				$('.redirectIn').html(counter);
				counter--;
			},1000); //delay is in milliseconds 
		});
		
		

		setTimeout(function(){
			 clearInterval(autoRedirectToHome);			 //clear above interval after 15 seconds
			 app.router.navigate('/home/')
		},16000);	
	}
});

	// Init/Create first view
	var homeView = app.views.create('#view-prototypeSelection', {
	  url: '/'
	});







