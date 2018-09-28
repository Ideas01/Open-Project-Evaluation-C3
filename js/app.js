/*
 * app.js
 *
 * Required .js files
 *  - framework 7 .js files
 *  - singleaccess.js
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


 /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  *  G L O B A L - F U N C T I O N S
  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  
function checkSize(){
	var element = $("#puzzleWrapper").children().first().children().first();
	if(element.width() > 32 && element.height() > 32 ){
		document.getElementById("puzzleWrapper").parentElement.lastChild.style.display = "none";
	}
	else{
		document.getElementById("puzzleWrapper").parentElement.lastChild.style.display = "inline-block";
	}
}
 /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  *  F R A M E W O R K     7
  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
// Framework7 App main instance
var app  = new Framework7({
    data: function (){
        return {
            pointCount: 144,
            clickedPuzzleTiles: [],
			currentContextIdIndex: null, 
			currentPuzzleImageId: null,
        }
    },
	methods: {
		nameSpaceIsAvailable: function(nameSpace) {
			if(document.querySelector("#" + nameSpace) != null){
				console.log("nope")
				return false;
			}else{
				console.log("yau")
				return true;
			}
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
	singleAccess.popUp_show('Spielanleitung',content);

    checkSize();
	
});

		
	

app.on('pageInit', function(page){
	
	
	const deviceName = "OpenProjectEvalSlider";
	var singleAccess = new SingleAccess();
	var prototypeImagesKey = null;
	
	console.log(page.name + " wird ausgeführt");
	
	function buildSwiperContent(callback){
		var counter = 0;
		var picturesPerChoice = 3;
		var selectionContent = {};
		
		singleAccess.waitForContexts(function(contextList){
			let contentArray = [];
			contextList.forEach(function(context, contextIndex, contextList){
			
				var imageURLs = contextList[contextIndex].images;
				counter = imageURLs.length;
				
				selectionContent = {
					aTitle:    '<h2 class ="prototypChoiceTitle">' + contextList[contextIndex].title + ' </h2>',
					bContent:  '<article class= "descriptionPChoice">' + contextList[contextIndex].description + '</article>',
				};
				
				for(var i=0; i < picturesPerChoice; i++){
					if(counter > 0){
						selectionContent['c'+ i +'Image' + i] =   '<div class="selectionImgWrapper"> <img class="prototypeSelectionImg" src="' + imageURLs[i].url + '"/></div>';
						counter --;
					}
				}
			
				contentArray.push(selectionContent);
			});
		
		callback(contentArray);
			
		});
	}
	
	/***************************** prototypeSelection********************/
	
	if(page.name ==='prototypeSelection'){
		
		singleAccess.initializeDB(deviceName);
		
		singleAccess.initializeSwiper();
		

		var requiredResults = ['id', 'title', 'description', 'images{url}'];
		
		singleAccess.getContexts(requiredResults, deviceName);

		buildSwiperContent(function(contentArray){
			 var mySwiper = singleAccess.buildSwiper(4, "prototypeSelectionSwiper", "pSelectionSwiper", "contentSwiper", contentArray);
			 
			 $(mySwiper.slides[0].childNodes).click(function(event){
					$('#'+ event.target.id).css({'border': 'solid 1px blue', 'width': '44%'});
					$(mySwiper.slides[0].childNodes).not('#'+ event.target.id).css({'border': 'none', 'width': '44%'});
					contextId = event.target.contextId;
					app.data.currentContextIdIndex = event.target.contextId;
			 });
		 });
		 
		 singleAccess.waitForContexts(function(contextList){
			singleAccess.updateDeviceContext(contextList[0], deviceName);
			
			/* singleAccess.waitForData("deviceContext", deviceName, function(response){
			}); */
		 });
		 
		 $('#startSelectPrototype').click(function(){
			 var contextGeupdated = new Promise(function(resolve){
				 if(app.data.currentContextIdIndex != null){
					 singleAccess.waitForContexts(function(contextList){
						 //TODO: noch prüfen ob update erfolgreich.
						singleAccess.updateDeviceContext(contextList[app.data.currentContextIdIndex], deviceName);
						resolve(0);
					});
				 };
			});	
			contextGeupdated.then(function(resolve){
				app.router.navigate('/home/');
			}); 				
		 });
			 
		
		 
		 
		
		/* singleAccess.waitForData("prototypeImages", deviceName, function(response){
			console.log(name + "erfolgreich zurück prototypeImages");
			console.log(response[0].id);
		}); */

		/* singleAccess.waitForData("questions", deviceName, function(response){
			console.log(name + "erfolgreich zurück questions");
			console.log(response[0].id);
			singleAccess.sendEvalData(response[0].id, 5, deviceName); //erg. muss noch gefüllt werden.
		}); */
		
		/* singleAccess.waitForData("puzzleImages", deviceName, function(response){
			console.log(name + "erfolgreich zurück pImages");
			console.log(response[0]);
		}); */

		/* singleAccess.waitForData("questions", deviceName, function(response){
			console.log(name + "erfolgreich zurück questions");
			console.log(response[0].type);
		});  */
		
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
    if (page.name === 'P2'){
        var imageArray = ["img/examples/PrototypBsp1.png", "img/examples/PrototypBsp2.png", "img/examples/PrototypBsp3.png"];
        singleAccess.initializeSwiper();
		
		//TODO aktuellen ContextIndex übergeben
		singleAccess.waitForContexts(function(contextList){
			singleAccess.getPrototypeImages(contextList[0], deviceName);
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
			console.log("imageArray")
			console.log(imageArray);
			let prototypeSwiper = document.querySelector('#prototypeSwiper').swiper;

			mySwiper = singleAccess.buildSwiper(1, "prototypeSwiper", "prototypeSwiperInner", "imageSwiper", imageArray);

			singleAccess.setHandler(mySwiper);
		});
		
		


		
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
			singleAccess.popUp_show('HILFE',content);
        });
    }
    /****************************** P2 end ****************************/


    /****************************** sliders start *********************/
    if (page.name === 'sliders') {
        $('#sendRatingsButton').hide();
        app.popup.close();

        singleAccess.waitForContexts(function (contextList) {
            singleAccess.updateDeviceContext(contextList[0], deviceName);
            singleAccess.getQuestions(contextList[0], deviceName);

            console.log("zurück contextlist");
            console.log(contextList);
        });

        singleAccess.waitForData("questions", deviceName, function (response) {
            //index where to start in the questions
            var currentIndex = 0;

            //to check if there are any questions left
            var remainingQuestions = response.length;

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

                //if there are questions left..
                if (remainingQuestions > 0) {
                    //array for saving the values of the sliders
                    var sliderValues = [];
                    //...save slider values of the existing sliders
                    for (var i = 0; i < rangeSliderReferences.length; i++) {
                        sliderValues.push({
                            id: rangeSliderReferences[i].questionId,
                            value: rangeSliderReferences[i].value + rangeSliderReferences[i].min
                        });
                    }
                    //TODO: DELETE AFTER TESTING
                    console.log(sliderValues);

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
                    //array for saving the values of the sliders
                    var sliderValues = [];
                    //save slider values of the existing sliders
                    for (var i = 0; i < rangeSliderReferences.length; i++) {
                        sliderValues.push({
                            id: rangeSliderReferences[i].questionId,
                            value: rangeSliderReferences[i].value + rangeSliderReferences[i].min
                        });
                    }
                    //TODO: DELETE AFTER TESTING
                    console.log(sliderValues);

                    //create the popup, which is used to get to the next page
 					let content = '<div class="block">' +
									'<p>Danke für deine persönliche Bewertung! Du wirst nun zu dem Puzzlespiel weitergeleitet. </p>' +
									// '<div class="sk-circle">' +
									// '<div class="sk-circle1 sk-child"></div>' +
									// '<div class="sk-circle2 sk-child"></div>' +
									// '<div class="sk-circle3 sk-child"></div>' +
									// '<div class="sk-circle4 sk-child"></div>' +
									// '<div class="sk-circle5 sk-child"></div>' +
									// '<div class="sk-circle6 sk-child"></div>' +
									// '<div class="sk-circle7 sk-child"></div>' +
									// '<div class="sk-circle8 sk-child"></div>' +
									// '<div class="sk-circle9 sk-child"></div>' +
									// '<div class="sk-circle10 sk-child"></div>' +
									// '<div class="sk-circle11 sk-child"></div>' +
									// '<div class="sk-circle12 sk-child"></div>' +
								'</div>' +
								'<a href="/puzzle/" class="button popup-close"> Weiter </a>'
					singleAccess.popUp_show('Popup',content);
                }
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
			singleAccess.popUp_show('HILFE',content);	
        });
    }
    /****************************** sliders end ****************************/



    /****************************** puzzle start ****************************/
 	if(page.name === 'puzzle') {
        var pointCount = app.data.pointCount;
 	    var clickedPuzzleTiles = [];
		var imageSrc = null;
		
		singleAccess.waitForContexts(function(contextList){
			singleAccess.getPuzzleImages(contextList[app.data.currentContextIdIndex]);
		});
		
		singleAccess.waitForData("puzzleImages", deviceName, function(puzzleImagesArray){
			console.log(name + "erfolgreich zurück pImages in puzzle");
			console.log(puzzleImagesArray);
			
			// imageSrc = puzzleImagesArray[Math.floor(Math.random() * Math.floor(puzzleImagesArray.length))]
			// console.log(imageSrc)

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
				var wrapperArray = ['#puzzleWrapper','#croppedImageDiv'];
				$('#puzzleWrapper').css("background-image", 'url("' + imageObject.src + '")');
					
				var puzzlePieceClassName = singleAccess.buildPuzzle(imageObject, '#puzzleWrapper', 12, 'blue', clickedPuzzleTiles, 6);
				console.log("PUZZLEPIECECLASSNAME: " + puzzlePieceClassName);
				singleAccess.calculateWrapperSize(imageObject, wrapperArray, 80);
					$(window).on('resize', function (page) {
						checkSize();
						singleAccess.calculateWrapperSize(imageObject, wrapperArray, 80);
					});
					
				return puzzlePieceClassName;
			}).then(function (puzzlePieceClassName) {
				$('.'+ puzzlePieceClassName).click(function (event) {
					event.target.style.visibility = "hidden";
					var puzzlePieceId = event.target.id.split('|');
					app.data.clickedPuzzleTiles.push(puzzlePieceId[1]);
					pointCount -= event.target.pointReduction;
				})
			});
		}); 
	
	}
	
		/****************************** puzzle end ****************************/
    if (page.name === 'puzzleGuess') {
        console.log(app.data.clickedPuzzleTiles);
        var contextId = app.data.currentPuzzleImageId;

        singleAccess.waitForContexts(function (contextList) {
            singleAccess.getPuzzleImages(contextList[0], deviceName);
            console.log("zurück contextlist");
            console.log(contextList);
        });
        new Promise(function (resolve,reject) {
            singleAccess.waitForData("puzzleImages", deviceName, function (response) {
                console.log(name + "erfolgreich zurück pImages");
                console.log(response);
                singleAccess.buildGuessButtons(contextId,response);

                var backgroundImage = new Image();
                backgroundImage.src = response[contextId].url;
                backgroundImage.onload = function () {
                    resolve(backgroundImage);
                };
                backgroundImage.onerror = function () {
                    reject("could not load the image");
                };
            })
        }).then(function (backgroundImage) {
            singleAccess.buildMiniOverview(4, 3, app.data.clickedPuzzleTiles, backgroundImage, '#puzzleOverview');
            console.log("bis hierher 4")
        });
    }

    /****************************** puzzleGuess end ****************************/

	if(page.name === 'success'){
		singleAccess.buildConfetty();
		var counter = 15;
		var autoRedirectToHome = setInterval(function(){
			console.log("counting...")
			$('.redirectIn').html(counter);
			counter--;
		},1000); //delay is in milliseconds 

		setTimeout(function(){
			 clearInterval(autoRedirectToHome);			 //clear above interval after 15 seconds
			 app.router.navigate('/home/')
		},16000);
		
		
	}
	
	if(page.name === 'failure'){
		singleAccess.buildConfetty();
		var counter = 15;
		var autoRedirectToHome = setInterval(function(){
			console.log("counting...")
			$('.redirectIn').html(counter);
			counter--;
		},1000); //delay is in milliseconds 

		setTimeout(function(){
			 clearInterval(autoRedirectToHome);			 //clear above interval after 15 seconds
			 app.router.navigate('/home/')
		},16000);
		
		
	}
	
	
});

	// Init/Create views
	var homeView = app.views.create('#view-prototypeSelection', {
	  url: '/'
	});

/* 	if(page.name === "settingsTest"){
        var key = 'person2';
        $('#saveSettings').click(function(){

        	if (window.localStorage) {
                    var person = {

                        Name: 'Hans Peter',

                        Age: 24,

                        Gender: 'Male',

                        Nationality: 'Nigerian'
                    };
                    localStorage.setItem(key, JSON.stringify(person));


                } else {
        			console.log("im localstorage ging was schief")
                }
        });
        $('#loadSettings').click(function() {
            alert(localStorage.getItem(key));
            console.log(JSON.parse(localStorage.getItem(key)));
        });

	}   */ /******* settings end *******/






