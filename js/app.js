// Dom7
var $$ = Dom7;

// Framework7 App main instance
var app  = new Framework7({
  root: '#app', // App root element
  id: 'io.framework7.testapp', // App bundle ID
  name: 'Framework7', // App name
  theme: 'auto', // Automatic theme detection
  // App root data
  data: function () {
    return {
      user: {
        firstName: 'John',
        lastName: 'Doe',
      }
    };
  },
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
        '<div class="right">' +
        '</div>' +
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
	var singleAccess = new SingleAccess();
	
	console.log(page.name + " wird ausgeführt");

	if(page.name === 'home'){
		
		var deviceName = "OpenProjectEvalSlider"
		singleAccess.initializeDB(deviceName);
		
		var requiredResults = ['id', 'title', 'description'];
		
		var contexts = singleAccess.getContexts(requiredResults, deviceName);
		
		
		
		function waitForContexts (callback){
			var waitforC = setInterval(function(){
				
				var contextList = singleAccess.getGlobalContextList();
				if(contextList[1] != undefined){
					console.log("ok");
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
		
		waitForContexts(function(contextList){
			console.log("zurück contextlist")
			console.log(contextList);
		});
		singleAccess.updateDeviceContext();
		
	} /****************************** home end ****************************/

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
    }
    /****************************** prototyp auswahl ende **************/


	/****************************** P2 Start ***************************/
    if (page.name === 'P2'){
        var imageArray = {
            imageUrls:  ["img/examples/PrototypBsp1.png", "img/examples/PrototypBsp2.png", "img/examples/PrototypBsp3.png"]
        };
        singleAccess.initializeSwiper();

        var mySwiper = singleAccess.fillSwiper(imageArray);

        singleAccess.setHandler(mySwiper);

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
                $('#guessOverview').append('<a class="button" id="'+i+'">'+ i +'</a>');
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
                alert("ist richtig");
            }
            else{
                alert("ist falsch");
            }
        }

    }
    /****************************** puzzleGuess end ****************************/

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






