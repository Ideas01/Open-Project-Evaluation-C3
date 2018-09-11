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



app.on('pageInit', function(page){
	var singleAccess = new SingleAccess();
	
	console.log(page.name + " wird ausgeführt");

	if(page.name === 'home'){
		
		var query = '{"query":"mutation cDevice {createDevice(data: {name: \\"TestAndroid\\"}) {device {id name context {id} owners {id}} token}}"}';
		var query2 = '{"query": "query gDevices {devices {id name}}"}'
		singleAccess.getToken(query);
		
		function getToken(callback){
			var tid = setInterval(function(){
				var T = singleAccess.getToken();
				if(T != null){
					alert("zurückgekommen als: " + T);
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
	

	
 	if(page.name === 'puzzle') {
		var backgroundorigin = {};
        
		var loadImage = new Promise(function (resolve, reject) {
            var backgroundImage = new Image();
            backgroundImage.src = 'https://i.imgur.com/fHyEMsl.jpg';
            backgroundImage.crossOrigin = "Anonymous";
            backgroundImage.onload = function () {
				const originPictureWidth = backgroundImage.width;
				const originPictureHeight = backgroundImage.height;
				backgroundorigin = {image: backgroundImage, imgWidth: originPictureWidth , imgHeight: originPictureHeight}
			    resolve(backgroundImage);
            };
            backgroundImage.onerror = function () {
                reject("could not load the image");
            };
        });



        //imgObj = new Image();
        //imgObj.src = 'https://www.advopedia.de/var/advopedia/storage/images/news/kurios/tierische-vorladung-wenn-die-katze-vor-gericht-muss/151031-1-ger-DE/tierische-vorladung-wenn-die-katze-vor-gericht-muss_ng_image_full.jpg';

        imgSource = 'https://i.imgur.com/fHyEMsl.jpg';

        var singleAccess = new SingleAccess();

        $('#puzzleWrapper').css("background-image", 'url("' + imgSource + '")');

        var gridReady = new Promise(function (resolve, reject) {
            //singleAccess.buildPuzzle(4, "#puzzleWrapper", "grid", "yellow", "gridPiece");
            singleAccess.buildPuzzle(4, "#puzzleWrapper", "grid","", "gridPiece");
			resolve("ready");
        });
        gridReady.then(function (fulfilled) {
            $(".gridPiece").each(function (n) {
                for (var i = 0; i < 4; i++) {
                    singleAccess.buildPuzzle(3, '#grid' + n + i, "puzzletile" + n + i, "blue", "puzzlePiece");
                }
                $('.puzzlePiece').each(function () {
                    $(this).attr('onclick', 'hideDiv(this)');
                });
            });
          /*  $('.gridPiece').each(function () {
                $(this).attr("onclick", "colorDiv(this)");
            }); */

        });




        singleAccess.buildPuzzle(4, "#puzzleGridWrapper", "overgrid", "lime", "overallGridPiece");

        calculateWrapperSize(imgSource, "#puzzleWrapper");
        calculateWrapperSize(imgSource, "#puzzleGridWrapper");
        calculateWrapperSize(imgSource, "#croppedImageDiv");

        $$(window).on('resize', function (page) {
            calculateWrapperSize(imgSource, "#puzzleWrapper");
            calculateWrapperSize(imgSource, "#puzzleGridWrapper");
            calculateWrapperSize(imgSource, "#croppedImageDiv");
        });

        $(".overallGridPiece").click(function (event) {


            var coordinateOld = (event.target.id).toString().split("d");
			var coordinate = Array.from(coordinateOld[1]);
			var xCoordinate = coordinate[0];
			var yCoordinate = coordinate[1];
			console.log("X: "+xCoordinate + "y: "+ yCoordinate);
            var pieceSize = {"pieceHeight": $('#croppedImageDiv').width()/4, "pieceWidth": $('#croppedImageDiv').width()/4};
			
			$('.overallGridPiece').toggle();
            $('.gridPiece:not(#grid' + coordinateOld[1] + ')').toggle();

            //TODO: image Object nur einmal bauen und mit getter holen.
            //var imgObj = new Image();
            //imgObj.src = 'https://www.advopedia.de/var/advopedia/storage/images/news/kurios/tierische-vorladung-wenn-die-katze-vor-gericht-muss/151031-1-ger-DE/tierische-vorladung-wenn-die-katze-vor-gericht-muss_ng_image_full.jpg';
			
            console.log("backgroundorigin: " + backgroundorigin.imgWidth + "+" + backgroundorigin.imgHeight);
			
			cropImage( backgroundorigin.imgWidth * xCoordinate/4, backgroundorigin.imgHeight * yCoordinate/4,  backgroundorigin.imgWidth/4, backgroundorigin.imgHeight/4,  backgroundorigin.imgWidth, backgroundorigin.imgHeight);
           // console.log("imagedivheight: " +  * xCoordinate/4 + "imagedivwidth: "+ $('#croppedImageDiv').height() * yCoordinate/4)
			$('#grid'+ coordinateOld[1]).width('100%');
            $('#grid'+ coordinateOld[1]).height('100%');



            $('#puzzleWrapper').append('<a class="button" id="backButton"><i class="f7-icons">close</i></a>');
            $('.button').click(function() {
				restorePuzzle('#croppedImageDiv');
                calculateTileSize(4,'gridPiece');
                $('.gridPiece:not(#grid' + coordinateOld[1] + ')').toggle();
                $('.overallGridPiece').toggle();
                $('.button').remove()
            })

        });

        function calculateWrapperSize(imgURL, element) {
            var image = new Image();
            image.src = imgURL;
            image.onload = function () {
                var imgFormat = image.width / image.height;
                var elemHeight = $(element).height();
                $(element).css("width", elemHeight * imgFormat + "px");
            };
            delete(image);
        }

        function cropImage(sourceStartX, sourceStartY, cutWidth, cutHeight, imgWidth, imgHeight) {
            loadImage.then(function (isLoaded) {
                var canvasA = document.createElement('canvas');
                canvasA.width = imgWidth;
                canvasA.height = imgHeight;

                var context = canvasA.getContext('2d');
                //		      (Bildobjekt,   X Koordinate, Y Koordinate, Breite, Höhe , startin CanvasX, startin CanvasY, canvasbreite, canvashöhe)
                context.drawImage(isLoaded, sourceStartX, sourceStartY, cutWidth, cutHeight, 0, 0, imgWidth, imgHeight);
                $('#croppedImageDiv').css('background-image', 'url("'+ canvasA.toDataURL() + '")');

            }).catch(function (notLoaded) {
                //console.log(notLoaded.message);
            })
        }

    }
	
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
                                                     '<p>Danke, dass du dir die Zeit genommen hast! Du kannst dir jetzt die Ansichten nochmal anschauen oder die Bewertung beginnen. </p>' +
                                                     '<a href="#" class="button popup-close"> Zurück </a>' +
                                                     '<a href="/sliders/" class="button popup-close"> Weiter </a>' +
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
	 }); */
	
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

