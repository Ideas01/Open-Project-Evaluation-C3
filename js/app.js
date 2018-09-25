// Dom7
var $$ = Dom7;

// Framework7 App main instance
var app  = new Framework7({
    data: function (){
        return {
            pointCount: 144,
            clickedPuzzleTiles: [],
			currentContextIdIndex: null
        }
    },
  root: '#app', // App root element
  id: 'io.framework7.testapp', // App bundle ID
  name: 'Framework7', // App name
  theme: 'auto', // Automatic theme detection
  // App routes
  routes: routes,
});

$$(document).on('page:afterin','.page[data-name="puzzle"]', function(page){
    var popup = app.popup.create({
        content:
        '<div class="popup" id="popupStart">' +
			'<div class="view">' +
				'<div class="page popupStartpage ">' +
					'<div class="navbar">' +
						'<div class="navbar-inner">' +
							'<div class="title">Spielanleitung</div>' +
							'<div class="right"></div>' +
						'</div>' +
					'</div>' +
					'<div class="page-content">' +
						'<div class="block">' +
							'<p>Erklärungstext ergänzen..... und richtigen icons einfügen <img src="img/swipe.png"/></p>' +
							'<a href="#" class="popup-close" >' +
								'<a class="button popup-close"> Los geht´s! </a>' +
							'</a>' +
						'</div>' +
					'</div>' +
				'</div>' +
			'</div>' +
        '</div>',
        on: {
            opened: function () {
            }
        },
        close: function () {
            $(".popup").remove();
        }
    });
    app.popup.open(popup.el, true);

    checkSize();
	
});

		
function checkSize(){
	var element = $("#puzzleWrapper").children().first().children().first();
	if(element.width() > 32 && element.height() > 32 ){
		document.getElementById("puzzleWrapper").parentElement.lastChild.style.display = "none";
	}
	else{
		document.getElementById("puzzleWrapper").parentElement.lastChild.style.display = "inline-block";
	}
}



app.on('pageInit', function(page){
	
	
	const deviceName = "OpenProjectEvalSlider";
	var singleAccess = new SingleAccess();
	var prototypeImagesKey = null;
	
	console.log(page.name + " wird ausgeführt");

if(page.name === 'home'){
		singleAccess.initializeDB(deviceName);
		
		var requiredResults = ['id', 'title', 'description', 'images{url}'];
		
		singleAccess.getContexts(requiredResults, deviceName);
				
		//console.log(contextsKey);
		
		waitForContexts(function(contextList){
			singleAccess.updateDeviceContext(contextList[0], deviceName);
			
			singleAccess.getPrototypeImages(contextList[0], deviceName);
			
			singleAccess.getQuestions(contextList[0], deviceName);
			
			singleAccess.getPuzzleImages(contextList[0], deviceName);
			
			
			
			console.log("zurück contextlist");
			console.log(contextList);
		});
		
		
		singleAccess.waitForData("prototypeImages", deviceName, function(response){
			console.log(name + "erfolgreich zurück prototypeImages");
			console.log(response[0].id);
		});

		singleAccess.waitForData("questions", deviceName, function(response){
			console.log(name + "erfolgreich zurück questions");
			console.log(response[0].id);
			singleAccess.sendEvalData(response[0].id, 5, deviceName); //erg. muss noch gefüllt werden.
		});
		
		/* singleAccess.waitForData("puzzleImages", deviceName, function(response){
			console.log(name + "erfolgreich zurück pImages");
			console.log(response[0].url);
		}); */
		
		
		

		/* singleAccess.waitForData("questions", deviceName, function(response){
			console.log(name + "erfolgreich zurück questions");
			console.log(response[0].type);
		});  */
		
		
	} /****************************** home end ****************************/

	

	function waitForContexts (callback){
		var waitforC = setInterval(function(){
			
			var contextList = singleAccess.getGlobalContextList();
			if(contextList[1] != undefined){
				clearInterval(waitforC);
				callback(contextList);
			}else{
				//console.log("leider kein Context");
			}
		},500); //delay is in milliseconds 

		setTimeout(function(){
			 clearInterval(waitforC); //clear above interval after 15 seconds
		},15000);
	}
	
		
/***************************** prototypeSelection********************/

	if(page.name ==='prototypeSelection'){
		singleAccess.initializeSwiper();
		
		//var contextCount =7;
		var contentArray = [];
		var counter = 0;
		var picturesPerChoice = 3;
		var selectionContent = {};
		var protoImages = [];

		new Promise(function(resolve){
			waitForContexts(function(contextList){
				var contextList = contextList;
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
						resolve(contentArray);
					});
			});
		 }).then(function(contentArray){
			 
			 var mySwiper = singleAccess.buildSwiper(4, "prototypeSelectionSwiper", "contentSwiper", contentArray);
			 
		 });
		 
		 $('.startSelectPrototype').click(function(){
			 if(currentContextId == null){
				 let popup = app.popup.create({
					content:
					'<div class="popup">' +
						'<div class="view">' +
							'<div class="page popupStartpage ">' +
								'<div class="navbar">' +
									'<div class="navbar-inner">' +
										'<div class="title">Kein Prototyp gewählt</div>' +
										'<div class="right"></div>' +
									'</div>' +
								'</div>' +
								'<div class="page-content">' +
									'<div class="block">' +
										'<p>Bitte wähle einen Eintrag aus.</p>' +
										'<a href="#" class="popup-close" >' +
											'<a class="button popup-close"> OK </a>' +
										'</a>' +
									'</div>' +
								'</div>' +
							'</div>' +
						'</div>' +
					'</div>',
					on: {
						opened: function () {
						}
					},
					close: function () {
						$(".popup").remove();
					}
				});
				app.popup.open(popup.el, true);
			 } else{
				 singleAccess.updateDeviceContext(contextList[currentContextIdIndex], deviceName);
			 }
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

	/****************************** P2 Start ***************************/
    if (page.name === 'P2'){
        var imageArray = ["img/examples/PrototypBsp1.png", "img/examples/PrototypBsp2.png", "img/examples/PrototypBsp3.png"];
        singleAccess.initializeSwiper();
		var mySwiper = singleAccess.buildSwiper(1, "prototypeSwiper", "imageSwiper", imageArray, prototypeSwiper);
		//TODO aktuellen ContextIndex übergeben
		waitForContexts(function(contextList){
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

			mySwiper = singleAccess.buildSwiper(1, "prototypeSwiper", "imageSwiper", imageArray, prototypeSwiper);

			singleAccess.setHandler(mySwiper);
		});
		
		


		
        $(".help").click(function () {
            var popup = app.popup.create({
                content:
                '<div class="popup" id="popupStart">' +
                '<div class="view">' +
                '<div class="page popupStartpage ">' +
                '<div class="navbar">' +
                '<div class="navbar-inner">' +
                '<div class="title">HILFE</div>' +
                '<div class="right">' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="page-content">' +
                '<div class="block">' +
                '<p>Du befindest dich gerade auf der Seite, in der du dir den vorgestellten Prototypen ' +
                'anschaust und vorerst beurteilst, schau dir beispielsweise die einzelnen Elemente an und überlege dir, '+
                'was du anders oder besser machen würdest. Wenn du nach links oder rechts wischst, kannst du zwischen den unterschiedlichen Prototypansichten wechseln. Anschließend, wenn du alle Seiten des Prototypen durchgeswiped hast, '+
                'kannst du eine Bewertung durchführen. <img src="img/swipe.png"/></p>'+
                '<a href="#" class="popup-close" >' +
                '<a class="button popup-close"> Los geht´s! </a>' +
                '</a>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>',
                on: {
                    close: function(){
                        $(".popup").remove();
                    }
                }
            });
            app.popup.open(popup.el,true);
        });
    }
    /****************************** P2 end ****************************/


    /****************************** sliders start *********************/
    if(page.name === 'sliders') {
        app.popup.close();
        //$('.range-sliders').css('display','none');
        //var deviceName = "OpenProjectEvalSlider";
        /*  waitForContexts(function(contextList){
              singleAccess.updateDeviceContext(contextList[0], deviceName);
              singleAccess.getQuestions(contextList[0], deviceName);

              console.log("zurück contextlist");
              console.log(contextList);
          }); */

        /*      singleAccess.waitForData("questions", deviceName, function(response){
                 console.log(name + "erfolgreich zurück questions");
                 console.log(response);
             }); */

        var response = [
            {min:2,
                max:10,
                stepSize:2,
                label:["zufrieden","unzufrieden"],
                value:"erste Frage"
            } ,
            {min:0,
                max:10,
                stepSize:10,
                label:["zufrieden","unzufrieden"],
                value:"zweite Frage"
            },
            {min:0,
                max:10,
                stepSize:5,
                label:["zufrieden","unzufrieden"],
                value:"dritte Frage"
            },
            {min:0,
                max:10,
                stepSize:5,
                label:["zufrieden","unzufrieden"],
                value:"vierte Frage"
            },
            {min:0,
                max:10,
                stepSize:1,
                label:["zufrieden","unzufrieden"],
                value:"fünfte Frage"
            },
            {min:0,
                max:10,
                stepSize:5,
                label:["zufrieden","unzufrieden"],
                value:"sechste Frage"
            },
            {min:0,
                max:10,
                stepSize:5,
                label:["zufrieden","unzufrieden"],
                value:"siebte "
            },
            {min:4,
                max:30,
                stepSize:5,
                label:["zufrieden","unzufrieden"],
                value:"8 frage"
            },
            {min:0,
                max:20,
                stepSize:5,
                label:["zufrieden","unzufrieden"],
                value:"9. frage"
            }/*,
           {min:0,
               max:40,
               stepSize:5,
               label:["zufrieden","unzufrieden"],
               value:"10. frage"
           } */
        ];
        console.log(response);


        //array for saving the values of the sliders
        var sliderValues = [];

        //index where to start in the questions
        var currentIndex = 0;

        //to check if there are any questions left
        var remainingQuestions = response.length;

        //initialize the sliders, starting with the data at startIndex
        try {
            var rangeSliderReferences = singleAccess.determineRangeSliderAmount(currentIndex, remainingQuestions, response);
        } catch (e) {
            if (e instanceof RangeError) {
                console.log(e.message);
            }
        }
        //raise the index, so we know at which point to access the data
        currentIndex += rangeSliderReferences.length;

        //when the button is clicked
        $("#sendRatingsButton").click(function(){
            //subtract the amount of initialized rangeSliders, so we know how many questions are left
            remainingQuestions -= rangeSliderReferences.length;

            //if there are questions left..
            if(remainingQuestions > 0){

                //...save slider values of the existing sliders
                for (var i=0;i< rangeSliderReferences.length; i++){
                    sliderValues.push({
                        id: rangeSliderReferences[i].questionId,
                        value: rangeSliderReferences[i].value + rangeSliderReferences[i].min
                    });
                }
                //TODO: DELETE AFTER TESTING
                console.log(sliderValues);

                //initialize the sliders, starting with data at startIndex
                try {
                    rangeSliderReferences = singleAccess.determineRangeSliderAmount(currentIndex, remainingQuestions, response);
                }catch (e) {
                    if (e instanceof RangeError) {
                        console.log(e.message);
                    }
                }
                //raise the index, so we know at which point to access the data
                currentIndex += rangeSliderReferences.length;
            }
            //no more questions to display
            else {
                //save slider values of the existing sliders
                for (var i=0;i< rangeSliderReferences.length; i++){
                    sliderValues.push({
                        id: rangeSliderReferences[i].questionId,
                        value: rangeSliderReferences[i].value + rangeSliderReferences[i].min
                    });
                }
                //TODO: DELETE AFTER TESTING
                console.log(sliderValues);

                //create the popup, which is used to get to the next page
                var popup = app.popup.create({
                    // The Popup
                    content:
                    '<div class="popup" id="popupStart">' +
                    '<div class="view">' +
                    '<div class="page">' +
                    '<div class="navbar">' +
                    '<div class="navbar-inner">' +
                    '<div class="title">Popup</div>' +
                    '<div class="right">' +
                    '<a href="#" class="link popup-close">Close</a>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="page-content">' +
                    '<div class="block">' +
                    '<p>Danke für deine persönliche Bewertung! Du wirst nun zu dem Puzzlespiel weitergeleitet. </p>' +
                    '<div class="sk-circle">' +
                    '<div class="sk-circle1 sk-child"></div>' +
                    '<div class="sk-circle2 sk-child"></div>' +
                    '<div class="sk-circle3 sk-child"></div>' +
                    '<div class="sk-circle4 sk-child"></div>' +
                    '<div class="sk-circle5 sk-child"></div>' +
                    '<div class="sk-circle6 sk-child"></div>' +
                    '<div class="sk-circle7 sk-child"></div>' +
                    '<div class="sk-circle8 sk-child"></div>' +
                    '<div class="sk-circle9 sk-child"></div>' +
                    '<div class="sk-circle10 sk-child"></div>' +
                    '<div class="sk-circle11 sk-child"></div>' +
                    '<div class="sk-circle12 sk-child"></div>' +
                    '</div>' +
                    '<a href="/puzzle/" class="button popup-close"> Weiter </a>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>',
                    on: {
                        opened: function () {
                        },
                        close: function(){
                            $(".popup").remove();
                        }
                    }
                });
                app.popup.open(popup.el,true);
            }
        });

        $(".help-sliders").click(function () {
            var popup = app.popup.create({
                content:
                '<div class="popup" id="popupStart">' +
                '<div class="view">' +
                '<div class="page popupStartpage ">' +
                '<div class="navbar">' +
                '<div class="navbar-inner">' +
                '<div class="title">HILFE</div>' +
                '<div class="right">' +
                '<a href="#" class="link popup-close">Close</a>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="page-content">' +
                '<div class="block">' +
                '<p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ' +
                'ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo ' +
                'dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit ' +
                'amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ' +
                'ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo ' +
                'dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>' +
                '<a href="#" class="popup-close" >' +
                '<a class="button popup-close"> Los geht´s! </a>' +
                '</a>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>',


                on: {
                    close: function () {
                        $(".popup").remove();
                    }
                }
            });
            app.popup.open(popup.el, true);
        });
    }
    /****************************** sliders end ****************************/


    /****************************** puzzle start ****************************/
 	if(page.name === 'puzzle') {
        var pointCount = app.data.pointCount;
 	    var clickedPuzzleTiles = [];

		var loadImage = new Promise(function (resolve, reject) {
            var backgroundImage = new Image();
            backgroundImage.src = 'img/katzie.jpg';
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
				
			var puzzlePieceClassName = singleAccess.buildPuzzle(imageObject, '#puzzleWrapper', 12, 'blue',clickedPuzzleTiles , 6);
			console.log("PUZZLEPIECECLASSNAME: " + puzzlePieceClassName);
			singleAccess.calculateWrapperSize(imageObject, wrapperArray, 80);
				$(window).on('resize', function (page) {
					checkSize();
				    singleAccess.calculateWrapperSize(imageObject, wrapperArray, 80);
				});
				
				// bis hierhin.
				
			//TODO noch den buildMiniOverview() so verändern, dass nur das parent()Element gegeben sein muss.	
            singleAccess.buildMiniOverview(imageObject,'#miniOverview', "#miniOverview","miniOverviewGrid","miniOverviewGridPiece",'#miniOverviewGrid',"miniOverviewPuzzletile","miniOverviewPuzzlePiece","");
		    return puzzlePieceClassName;
		}).then(function (puzzlePieceClassName) {
            $('.'+ puzzlePieceClassName).click(function (event) {
                event.target.style.visibility = "hidden";
                var puzzlePieceId = event.target.id.split('|');
                app.data.clickedPuzzleTiles.push(puzzlePieceId[1]);
                pointCount -= event.target.pointReduction;
            })
        });
	}
	
	/****************************** puzzle end ****************************/
    if(page.name === 'puzzleGuess'){
    console.log(app.data.clickedPuzzleTiles);



        var guessItems = {
            Tiere : [
                'Katze','Hund','Maus'
            ],
            Autos : [
                'Audi','BMW','Ford','Mercedes'
            ],
            Küche: [
                'Messer', 'Gabel', 'Kühlschrank', 'Topf', 'Eisfach','Herd'
            ]
        };
        var isCorrect = 'Katze';

        var loadImage2 = new Promise(function (resolve, reject) {
            var backgroundImage = new Image();
            backgroundImage.src = 'img/katzie.jpg';
            backgroundImage.crossOrigin = "Anonymous";
            backgroundImage.onload = function () {
                resolve(backgroundImage);
            };
            backgroundImage.onerror = function () {
                reject("could not load the image");
            };
        });
        loadImage2.then(function (backgroundImage) {
            //(image, div, appendToDOMOverview, namespaceOverview, classNameOverview, appendToDOMTiles, namespaceTiles, classNameTiles)
            singleAccess.buildMiniOverview(backgroundImage,'#puzzleOverview',"#puzzleOverview","miniOverviewGrids","miniOverviewGridPiece",'#miniOverviewGrids',"miniOverviewPuzzletiles","miniOverviewPuzzlePiece",app.data.clickedPuzzleTiles);
        }).then(function () {
            //for each property in guessItems...
            $.each(guessItems, function (i,value) {
                //...append a button, set the caption to the guessItems Objects property name...
                $('#guessOverview').append('<a class="guessButton" id="'+ i +'">'+ i +'</a>');
                //...and set a click listener for each button
                $('#'+i).click(function () {
                    //empty the container, which holds the values of the properties
                    $('#guessItems').empty();
                    //for each value of a property...
                    $.each(value,function (i) {
                        //...append a button, set the caption to the i-th value of the property
                        $('#guessItems').append('<a class="guessButton" id="'+value[i]+'">'+ value[i]+'</a>');
                        $('#'+value[i]).click(function () {
                            checkGuessItem(value[i],isCorrect);
                        })
                    });
                })
            });
        }).then(function () {
            //append the first property of the guessItems Object by default
            $.each((guessItems[Object.keys(guessItems)[0]]),function (i,value) {
                $('#guessItems').append('<a class="guessButton" id="'+value+'">'+ value+'</a>');
                $('#'+value).click(function () {
                    checkGuessItem(value,isCorrect);
                })
            })
        });
        function checkGuessItem(item,correctItem) {
            if(item === correctItem){
				app.router.navigate('/success/');
            }
            else{
				app.router.navigate('/failure/');
            }
        }

    }
    /****************************** puzzleGuess end ****************************/

	if(page.name === 'success'){
		singleAccess.buildConfetty();
	}
	
	
});

	// Init/Create views
	var homeView = app.views.create('#view-home', {
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






