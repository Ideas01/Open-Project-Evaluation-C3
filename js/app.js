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
			currentPuzzleImageId: null
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
	let content = 	'<div class="block">' +
						'<p>Danke für deine Bewertung! Jetzt kannst du an dem Puzzlespiel teilnehmen. Deine Aufgabe' +
							'ist es anschließend zu erraten, was sich hinter dem Puzzle befindet. Du hast die Wahl, dein Punktestand befindet' +
							'sich bei 100. Für jedes Puzzleteil, das du aufdeckst, werden dir 10 Punkte abgezogen. Umso weniger du aufdeckst ' +
							'desto mehr Punkte bleiben dir erhalten. Sobald du glaubst, zu wissen, was sich hinter dem Puzzle verbirgt, kannst' +
							'du weiter klicken und raten. Viel Erfolg! <img src="img/zoomin.png"style="width: 15%;"/>' +
							' <img src="img/tab.png"style="width: 15%;"/></p>' +
						'<a href="#" class="popup-close" >' +
							'<a class="button popup-close"> Los geht´s! </a>' +
						'</a>' +
					'</div>'	
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
	
	function danksagungStarten(){
		var waiting = setInterval(function(){
			$('#danksagungSlider').html('Vielen Dank für deine Bewertung! Du wirst nun zu unserem Puzzlespiel weitergeleitet.')
			$('#waitingMarks').show();
		},2000); //delay is in milliseconds 

		setTimeout(function(){
			 clearInterval(waiting);			 //clear above interval after 15 seconds
			 app.router.navigate('/puzzle/')
		},4000);
	}
	
	function waitForResponse(){
		$('#danksagungSlider').html('Auswertung wird gesendet.');
		$('#waitingMarks').show();
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
			 $('#danksagungSlider').html('Auswertung konnte nicht gesendet werden. Bitte überprüfen Sie die Internetverbindung und versuchen es erneut');
			 $('#waitingMarks').hide();
			 $('#repeatSendEvalData').show();
			 
		}, 60000);
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
		// do nothing.	
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
		});
		$(".arrow").removeClass("fadeInOut");
		
        $(".help").click(function () {
			let content = '<div class="block">' +
								'<p>Du befindest dich gerade auf der Seite, in der du dir den vorgestellten Prototypen ' +
								'anschaust und vorerst beurteilst, schau dir beispielsweise die einzelnen Elemente an und überlege dir, '+
								'was du anders oder besser machen würdest. Wenn du nach links oder rechts wischst, kannst du zwischen den unterschiedlichen Prototypansichten wechseln. Anschließend, wenn du alle Seiten des Prototypen durchgeswiped hast, '+
								'kannst du eine Bewertung durchführen. <img src="img/swipe.png"/></p>'+
								'<a href="#" class="popup-close" >' +
									'<a class="button popup-close"> Los geht´s! </a>' +
								'</a>' +
							'</div>'
			singleAccess.util_PopUp('HILFE',content);
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
			let content = 	'<div class="block">' +
								'<p>Danke, dass du dir den vorgestellten Prototypen angeschaut hast. Im folgenden kannst du nun die ' +
									'angegebenen Fragen beantworten und diese dementsprechend bewerten. Dabei kannst du einfach anhand ' +
									'der Slider, für dich persönlich festlegen, wie gut oder schlecht du etwas empfunden hast. Sobald du ' +
									'die Bewertung abgeschlossen hast, kannst du diese abschicken und an dem Puzzlespiel teilnehmen.'+
								'</p>' +
								'<a href="#" class="popup-close" >' +
									'<a class="button popup-close"> Los geht´s! </a>' +
								'</a>' +
							'</div>' 
			singleAccess.util_PopUp('HILFE',content);	
        });
    }
    /****************************** sliders end ****************************/



    /****************************** puzzle start ****************************/
 	if(page.name === 'puzzle') {
		if(puzzle == undefined)
			puzzle = new Puzzle(); // new puzzle 
        var imageSrc = null;
		
		singleAccess.waitForContexts(function(contextList){
			singleAccess.getPuzzleImages(contextList[singleAccess.getCurrentContextIdIndex()]);
		});
		
		singleAccess.waitForData("puzzleImages", deviceName, function(puzzleImagesArray){

			var loadImage = new Promise(function (resolve, reject) {
				var backgroundImage = new Image();
				let randomImageId = Math.floor(Math.random() * Math.floor(puzzleImagesArray.length));
				
			backgroundImage.src = puzzleImagesArray[randomImageId].url;
				app.data.currentPuzzleImageId = randomImageId;
				
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
				var puzzlePieceClassName = singleAccess.buildPuzzle(puzzle.puzzleWrapper, puzzle);
				singleAccess.calculateWrapperSize(puzzle, wrapperArray, 100);
					
				$(window).on('resize', function (page) {
					singleAccess.checkGrid(puzzle.puzzleWrapper);
					singleAccess.calculateWrapperSize(puzzle, wrapperArray, 100);
				});
					
				return puzzlePieceClassName;
			})
		}); 
		
		$("#helpPuzzle").click(function () {
			let content = 	'<div class="block">' +
								'<p> Vielen Dank für deine Teilnahme an dieser Umfrage. <br/>'+
								'Als kleines Dankeschön kannst du auf dieser Seite ein Puzzlespiel lösen. <br/>'+
								'Die Regeln sind ganz einfach: <br/><br/>'+
								'Ziel des Spiels ist es das Bild unter den Teilen zu erraten. <br/>'+
								'Für jedes aufgedekte Teil werden dir von den Punkten links oben Punkte abgezogen.'+ 
								'Also versuche möglichst wenig Teile aufzudecken um das Puzzle zu lösen.<br/><br/>' +
								'Viel Erfolg und viel Spaß dabei <br/><br/>'+
								'</p>' +
								'<a href="#" class="popup-close" >' +
									'<a class="button popup-close"> Los geht´s! </a>' +
								'</a>' +
							'</div>' 
			singleAccess.util_PopUp('HILFE',content);	
        });
	}
	
		/****************************** puzzle end ****************************/
    if (page.name === 'puzzleGuess') {
        var wrapperArray = ['#puzzleOverview'];
		var puzzleImageID = app.data.currentPuzzleImageId;

        singleAccess.waitForContexts(function (contextList) {
            singleAccess.getPuzzleImages(contextList[app.data.currentContextIdIndex], deviceName);
        });
        new Promise(function (resolve,reject) {
            singleAccess.waitForData("puzzleImages", deviceName, function (response) {
                singleAccess.buildCategories(puzzleImageID,response);

                var backgroundImage = new Image();
                backgroundImage.src = response[puzzleImageID].url;
                backgroundImage.onload = function () {
                    resolve(backgroundImage);
                };
                backgroundImage.onerror = function () {
                    reject("could not load the image");
                };
            })
        }).then(function (backgroundImage) {
            singleAccess.buildMiniOverview('#puzzleOverview', puzzle);
        });
		
		$(window).on('resize', function (page) {
			singleAccess.calculateWrapperSize(puzzle, wrapperArray, 60);
		});
		
		$("#helpPuzzleGuess").click(function () {
			let content = 	'<div class="block">' +
								'<p> Auf dieser Seite kannst du erraten was unter dem zuvor verdeckten Bild zu sehen ist. <br/>'+
								'Hierzu wähle einfach im oberen Bereich zunächst die Kategorie aus zu der der Bildinhalt passt '+
								'und wähle darunter die Lösung, die du für richtig hällst. <br/><br/>'+
								'Noch ein Tipp: <br/>'+
								'Falls du in der gewählten Kategorie nicht den gewünschten Begriff finden kannst geh '+
								'besser noch einmal eine Seite zurück und decke mehr Teile auf. <br/>'+ 
								'Viel Erfolg! <br/><br/>'+
								'</p>' +
								'<a href="#" class="popup-close" >' +
									'<a class="button popup-close"> Los geht´s! </a>' +
								'</a>' +
							'</div>' 
			singleAccess.util_PopUp('HILFE',content);	
        });
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
		puzzle = new Puzzle(); // new puzzle 
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
});

	// Init/Create first view
	var homeView = app.views.create('#view-prototypeSelection', {
	  url: '/'
	});







