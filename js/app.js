var imgObj;

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
        checkSize();
		
		$(window).on('resize', function(){
			checkSize();
		});
		
		
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
		var query = '{"query":"mutation cDevice {createDevice(data: {name: \\"TestAndroid\\"}) {device {id name context {id} owners {id}} token}}"}';
		//var query2 = '{"query": "query gDevices {devices {id name}}"}'
		singleAccess.getToken(query);
		
		function getToken(callback){
			var tid = setInterval(function(){
				var T = singleAccess.getToken();
				if(T != null){
					console.log("zurückgekommen als: " + T);
					clearInterval(tid);
					callback(T);
					//do s.th with T.

				}else{
					//console.log("leider nicht");
				}
			},500); //delay is in milliseconds 

			setTimeout(function(){
				 clearInterval(tid); //clear above interval after 15 seconds
			},15000);
		
		}
		
		getToken(function(T){
			console.log("callbacked: " + T)
		});
	}
	/****************************** home end ****************************/
	if(page.name === "settingsTest"){
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

	}   /******* settings end *******/
	
	if(page.name === 'sliders') {
        app.popup.close();
		var sliderValues = [];

		//test-data
		var testDataObj = {
			questionCount: 4,
			headerArray: [
				"Frage1", "Frage2", "Frage3", "Frage4", "Frage5"
			]
		};
		var singleAccess = new SingleAccess();

		//create range-sliders for the questions and save their references
		var rangeSliderReferences = singleAccess.createRangeSliders(testDataObj.questionCount);


		$('#bewertungBtn').click(function () {
			alert("es wurde gegklickt");
			var rangeSliderValues = [];

			for (var i = 0; i < rangeSliderReferences.length; i++) {
				rangeSliderValues[i] = rangeSliderReferences[i].getValue();
			}
		});
    }
	/****************************** sliders end ****************************/


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

        var imageSource;

        var loadImage = new Promise(function (resolve, reject) {
            var backgroundImage = new Image();
            backgroundImage.src = 'https://i.imgur.com/fHyEMsl.jpg';
            backgroundImage.crossOrigin = "Anonymous";
            backgroundImage.onload = function () {
                resolve(backgroundImage);
            };
            backgroundImage.onerror = function () {
                reject("could not load the image");
            };
        });
        loadImage.then(function (backgroundImage) {
        	imageSource = backgroundImage.src;
        	singleAccess.buildMiniOverview(imageSource,'#puzzleOverview',"#puzzleOverview","miniOverviewGrid","miniOverviewGridPiece",'#miniOverviewGrid',"miniOverviewPuzzletile","miniOverviewPuzzlePiece");
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
						singleAccess.calculateWrapperSize(imageObject, wrapperArray, 80);
				});
				
				// bis hierhin.
				
			//TODO noch den buildMiniOverview() so verändern, dass nur das parent()Element gegeben sein muss.	
			singleAccess.buildMiniOverview(imageObject,'#miniOverview', "#miniOverview","miniOverviewGrid","miniOverviewGridPiece",'#miniOverviewGrid',"miniOverviewPuzzletile","miniOverviewPuzzlePiece");
		});

        
	}
	
	/****************************** puzzle end ****************************/
	
if (page.name === 'P2'){
		imageArray.currentIndex = imageArray.startIndex;
		imageArray.maxIndex = imageArray.imageUrls.length -1;

		//create div, which displays the prototype images
		var imageDiv = document.createElement("div");
		imageDiv.style.backgroundImage = "url("+ getImageUrl(imageArray.imageUrls,imageArray.currentIndex);
		imageDiv.className = "imageDiv";
		imageDiv.style.backgroundSize = "contain";
		imageDiv.style.backgroundRepeat = "no-repeat";
		imageDiv.style.width = "100%";
		imageDiv.style.height = "100%";

		$(".testslider").append(imageDiv);

			// initializing Slideshow Swiper
		var mySwiper = new Swiper('.swiper-container', {
			spaceBetween: 100
		});
		
		var mySwiper = document.querySelector('.swiper-container').swiper;
		
		for(var n=0; n < imageArray.imageUrls.length; n++){
			mySwiper.appendSlide('<div class="testslider swiper-slide" id="swiper' + n + '"></div>');
			$("#swiper" +n).css('background-image','url("' + getImageUrl(imageArray.imageUrls,n) +'")');
            $("#swiper"+n).css('background-size',"contain");
            $("#swiper"+n).css('background-repeat',"no-repeat");
		}

		mySwiper.on('slidePrevTransitionStart', function () {
        	mySwiper.off('slideNextTransitionEnd');
		});

        mySwiper.on('touchEnd', function () {
                if (mySwiper.isEnd) {
                    mySwiper.on('slideNextTransitionEnd', function () {
						$(".popup").remove();
                        var popup = app.popup.create({
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
												'<p>Vielen Dank! Du hast dir alle Seiten des Prototypen angeschaut. </p>' +
												'<div class="next" text-align="center">' +
													'<a href="/prototype/" class="button"> Zurück </a>' +
													'<a href="/sliders/" class="button"> Weiter </a>' +
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
							close: function(){
								$(".popup").remove();
							}
                        });
                        app.popup.open(popup.el, true);
                    });
                }
        });
		
	 $(".help").click(function () {
	 //$(".popup").remove();
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
	
	$(".button").click(function(){
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
});

	
	//add click functionality for the right(next) chevron
	var versuch;
	$(".next-link").click(function () {
		
		/* var query = '{"query":"mutation cDevice {createDevice(data: {name: \\"TestAndroid\\"}) {device {id name context {id} owners {id}} token}}"}';
		var query2 = '{"query": "query gDevices {devices {id name}}"}'
		
		var T = null;	
		
		const asyncInit = $.ajax({
			url: 'http://localhost:3000/',
			headers: {
				//'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc3NGQxMWJkNDJiMGE5MmE4MDhiMjE5NDIyMjUxMmQxMjQzY2QzYmQwODJlM2EyMzNlMTk3NDFkNjljNzQ1NzciLCJ0eXBlIjoiZGV2aWNlIiwiaWF0IjoxNTM2MDUxMDI3fQ.39dr_SrXSLoBIXVh1GVBSmAovy6jtMwTQV28uAa6YHE', 
				'Content-Type':'application/json',
			},
			method: 'POST',
			dataType: 'json',
			data: query,
			success: function(r){
			  console.log('success:' + r.data.createDevice.token);
			  const globalData = r.data.createDevice.token;
			  console.log("globaleVariable T:  " + globalData);
			  T = globalData;
			},
			 error: function (r) {
				console.log('error' + r.Token);
			}
			
		  });
		
			  
		var tid = setInterval(function(){
			if(T != null){
				alert("habs" + T);
				clearInterval(tid);
				return T;

			}else{
				console.log("leider nicht");
			}
			
		  //before getting cleared by below timeout. 
			},500); //delay is in milliseconds 

		alert("after setInterval"); //called second

		setTimeout(function(){
			 clearInterval(tid); //clear above interval after 15 seconds
		},15000);
		
		console.log("Tneu" + T); */
		
	}); 
	
 	$(".startBtn").click(function(){
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

	//add click functionality for the left(next) chevron
	$(".back-link").click(function () {
		if(imageArray.currentIndex > 0) {
			imageDiv.style.backgroundImage = "url(" + getImageUrl(imageArray.imageUrls, --imageArray.currentIndex);
		}
		else if(imageArray.currentIndex == 0){
		}
	});
	
/* 	 $(".help").click(function () {               
			 //$(".popup").remove();
        var popup = app.popup.create({
				content:
				'<div class="popup" id="popupStart">' +
				   '<div class="view">' +
						'<div class="page popupStartpage">' +
						  '<div class="popupNavbar">' +
							   '<div class="navbar-inner">' +
								  '<div class="title">HILFE</div>' +
						   '<div class="right">' +
							'</div>' +
							  '</div>' +
								'</div>' +
									'<div class="page-content">' +
									'<div class="block">' +
										'<p>Du befindest dich gerade auf der Seite, in der du dir den vorgestellten Prototypen nur ' +
										'anschaust und vorerst beurteilst, schau dir beispielsweise die einzelnen Elemente an und überlege dir, '+ 
										'was du anders oder besser machen würdest. Anschließend, wenn du alle Seiten des Prototypen durchgeswiped hast, '+
										'kannst du eine Bewertung durchführen.</p>' +
										'<a href="#" class="popup-close">' +
											'<img src="img/OK.png" class="popup-close">' +
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
	 });*/
	
});

	// Init/Create views
	var homeView = app.views.create('#view-home', {
	  url: '/'
	});




function getImageUrl(urlArray, imageIndex)
{
    return urlArray[imageIndex];
}

//js Object, which contains all available prototype images
var imageArray = {
    imageUrls:  ["img/examples/PrototypBsp1.png", "img/examples/PrototypBsp2.png", "img/examples/PrototypBsp3.png"]
};

