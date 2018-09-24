// Dom7
var $$ = Dom7;

// Framework7 App main instance
var app  = new Framework7({
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
				console.log("leider kein Context");
			}
		},500); //delay is in milliseconds 

		setTimeout(function(){
			 clearInterval(waitforC); //clear above interval after 15 seconds
		},15000);
	}
	/****************************** prototype Auswahl start *************/
	if(page.name === 'auswahl'){
        $("#startButton").click(function(){
            var popup = app.popup.create({
                // The Popup
                content:
                '<div class="popup" id="popupStart">' +
					'<div class="view">' +
						'<div class="page popupStartpage">' +
							'<div class="navbar popupNavbar">' +
								'<div class="navbar-inner">' +
									'<div class="title">Popup</div>' +
									'<div class="right">' +
										'<a href="#" class="link popup-close">Close</a>' +
									'</div>' +
								'</div>' +
							'</div>' +
							'<div class="page-content">' +
								'<div class="block">' +
									'<p>START PROTOTYP RATING</p>' +
									'<div class="next" text-align="center">' +
										'<a href="/prototype/" class="popup-close">' +
										'<img src="img/start.svg" class="next-button">' +
										'</a>' +
									'</div>' +
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
        });
		
		
		/* singleAccess.waitForData("prototypeImages", deviceName, function(response){
			console.log(name + "erfolgreich zurück prototypeImages")
			console.log(response[0].url);
			console.log(response[1].url);
			
		}); */
    } /****************************** prototyp auswahl ende **************/
		
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
			console.log("contextlist")
			console.log(contextList)
				contextList.forEach(function(context, contextIndex, contextList){
					
					var imageURLs = contextList[contextIndex].images;
					console.log("imageUrls")
					console.log(imageURLs)
					counter = imageURLs.length;
					
					
					selectionContent = {
						aTitle:    '<h2 class ="prototypChoiceTitle" id="versuchstitel">' + contextList[contextIndex].title + ' </h2>',
						bContent:  '<article class= "descriptionPChoice">' + contextList[contextIndex].description + '</article>',
					};
					
					for(var i=0; i < picturesPerChoice; i++){
						if(counter > 0){
							selectionContent['c'+ i +'Image' + i] =   '<div class="selectionImgWrapper"> <img class="prototypeSelectionImg" src="' + imageURLs[i].url + '"/></div>';
							counter --;
						}
					
					}
					
					
					console.log("selectionContent");
					console.log(selectionContent)
					contentArray.push(selectionContent);
					
					console.log("contentArray vorher");
					console.log(contentArray)
					resolve(contentArray);
				});
		});
	 }).then(function(contentArray){
		 var mySwiper = singleAccess.buildSwiper(4, "prototypeSelectionSwiper", "contentSwiper", contentArray);
		 
	 });
	  
	 
	  
	
	var imageArray = ["img/examples/PrototypBsp1.png", "img/examples/PrototypBsp2.png", "img/examples/PrototypBsp3.png"];
	
	
	//Testarray für mehr inhalt
	/* contentArray = [{
		title:    '<h2 class ="prototypChoiceTitle" id="versuchstitel"> title1 </h2>',
		content:  '<article class= "descriptionPChoice">Weit hinten, hinter den Wortbergen, fern der Länder Vokalien und Konsonantien leben die Blindtexte. Abgeschieden wohnen sie in Buchstabhausen an der Küste des Semantik, eines großen Sprachozeans.</article>',
		image1:	  '<img class="prototypeSelectionImg" src="'+ +'"/>',
		image2:   '<img class="prototypeSelectionImg" src="'+ +'"/>'
	},{
		title:    '<h2 class ="prototypChoiceTitle"> title2 </h2>',
		content:  '<article class= "descriptionPChoice">Weit hinten, hinter den Wortbergen, fern der Länder Vokalien und Konsonantien leben die Blindtexte. Abgeschieden wohnen sie in Buchstabhausen an der Küste des Semantik, eines großen Sprachozeans.</article>',
		image1:	  '<img class="prototypeSelectionImg" src="'+ +'"/>',
		image2:   '<img class="prototypeSelectionImg" src="'+ +'"/>'
	},{
		title:    '<h2 class ="prototypChoiceTitle"> title3 </h2>',
		content:  '<article class= "descriptionPChoice">Weit hinten, hinter den Wortbergen, fern der Länder Vokalien und Konsonantien leben die Blindtexte. Abgeschieden wohnen sie in Buchstabhausen an der Küste des Semantik, eines großen Sprachozeans.</article>',
		image1:	  '<img class="prototypeSelectionImg" src="'+ +'"/>',
		image2:   '<img class="prototypeSelectionImg" src="'+ +'"/>'
	},{
		title:    '<h2 class ="prototypChoiceTitle"> title 4 </h2>',
		content:  '<article class= "descriptionPChoice">Weit hinten, hinter den Wortbergen, fern der Länder Vokalien und Konsonantien leben die Blindtexte. Abgeschieden wohnen sie in Buchstabhausen an der Küste des Semantik, eines großen Sprachozeans.</article>',
		image1:	  '<img class="prototypeSelectionImg" src="'+ +'" />',
		image2:   '<img class="prototypeSelectionImg" src="'+ +'"/>'
	}]; */
	

	 

	$('.swiper-slide').each(function (index,value) {
		for (var i=0;i < mySwiper.contextPerPage;i++){
			singleAccess.buildPrototypeChoice(i,value.id);
		}
	});




	$("#startButton").click(function(){
		// hier ausgewählten Eintrag mit updateContext versehen.
	});


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
        var sliderValues = [];

        //test-data
        var testDataObj = {
            questionCount: 10,
            headerArray: [
                "Frage1", "Frage2", "Frage3", "Frage4", "Frage5"
            ]
        };

        //set variable for the remaining questions
        var remainingQuestions = testDataObj.questionCount;
        var rangeSliderReferences = singleAccess.createRangeSliders(remainingQuestions);

        $("#sendRatingsButton").click(function(){
            remainingQuestions -= rangeSliderReferences.length;

            if(remainingQuestions > 0){

                //save slider values of the existing sliders
                for (var i=0;i< rangeSliderReferences.length; i++){
                    sliderValues.push(rangeSliderReferences[i].value);
                    $('.range-bar').remove();
                    $('.range-knob-wrap').remove();
                }
                rangeSliderReferences = singleAccess.createRangeSliders(remainingQuestions);
                for(var i=0; i<=remainingQuestions;i++){
                    app.range.setValue('#slider'+i,0);
                }
            }
            else {
                for (var i=0;i< rangeSliderReferences.length; i++){
                    sliderValues.push(rangeSliderReferences[i].value);
                }
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

 	if(page.name === 'puzzle') {
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
				
			singleAccess.buildPuzzle(imageObject, '#puzzleWrapper', 12, 'blue',"" , 6);		
			singleAccess.calculateWrapperSize(imageObject, wrapperArray, 80);
				$(window).on('resize', function (page) {
					checkSize();
				    singleAccess.calculateWrapperSize(imageObject, wrapperArray, 80);
				});
				
				// bis hierhin.
				
			//TODO noch den buildMiniOverview() so verändern, dass nur das parent()Element gegeben sein muss.	
			singleAccess.buildMiniOverview(imageObject,'#miniOverview', "#miniOverview","miniOverviewGrid","miniOverviewGridPiece",'#miniOverviewGrid',"miniOverviewPuzzletile","miniOverviewPuzzlePiece");
		});

        
	}
	
	/****************************** puzzle end ****************************/
    if(page.name === 'puzzleGuess'){
				
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

        //var imageSource;

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
            //imageSource = backgroundImage.src;
            singleAccess.buildMiniOverview(backgroundImage,'#puzzleOverview',"#puzzleOverview","miniOverviewGrid","miniOverviewGridPiece",'#miniOverviewGrid',"miniOverviewPuzzletile","miniOverviewPuzzlePiece");
        }).then(function () {
            //for each property in guessItems...
            $.each(guessItems, function (i,value) {
                //...append a button, set the caption to the guessItems Objects property name...
                $('#guessOverview').append('<a class="button" id="'+ i +'">'+ i +'</a>');
                //...and set a click listener for each button
                $('#'+i).click(function () {
                    //empty the container, which holds the values of the properties
                    $('#guessItems').empty();
                    //for each value of a property...
                    $.each(value,function (i) {
                        //...append a button, set the caption to the i-th value of the property
                        $('#guessItems').append('<a class="button" id="'+value[i]+'">'+ value[i]+'</a>');
                        $('#'+value[i]).click(function () {
                            checkGuessItem(value[i],isCorrect);
                        })
                    });
                })
            });
        }).then(function () {
            //append the first property of the guessItems Object by default
            $.each((guessItems[Object.keys(guessItems)[0]]),function (i,value) {
                $('#guessItems').append('<a class="button" id="'+value+'">'+ value+'</a>');
                $('#'+value).click(function () {
                    checkGuessItem(value,isCorrect);
                })
            })
        });
        function checkGuessItem(item,correctItem) {
            if(item === correctItem){
				app.router.navigate('/success/');
                //alert("ist richtig");
            }
            else{
				app.router.navigate('/failure/');
                alert("ist falsch");
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






