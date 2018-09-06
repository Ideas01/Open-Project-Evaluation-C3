var singleAccess = new SingleAccess();

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
  // App root methods
  methods: {
    helloWorld: function () {
      app.dialog.alert('Hello World!');
    },
  },
  // App routes
  routes: routes,
});

app.on('pageInit', function(page){
	console.log(page.name + " wird ausgeführt");

	if(page.name === 'home'){
		var query = '{"query":"mutation cDevice {createDevice(data: {name: \\"TestAndroid\\"}) {device {id name context {id} owners {id}} token}}"}';
		var query2 = '{"query": "query gDevices {devices {id name}}"}'
		
		var T = null;	
		
		const asyncInit = $.ajax({
			url: 'http://192.168.43.174:3000/',
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
	

	
 	if(page.name === 'puzzle'){

		imgObj = new Image();
		imgObj.src = 'https://www.advopedia.de/var/advopedia/storage/images/news/kurios/tierische-vorladung-wenn-die-katze-vor-gericht-muss/151031-1-ger-DE/tierische-vorladung-wenn-die-katze-vor-gericht-muss_ng_image_full.jpg';
		
		
		var windowWidth = window.screen.width;
		var windowHeight = window.screen.height;
	
		imgSource= "https://www.advopedia.de/var/advopedia/storage/images/news/kurios/tierische-vorladung-wenn-die-katze-vor-gericht-muss/151031-1-ger-DE/tierische-vorladung-wenn-die-katze-vor-gericht-muss_ng_image_full.jpg";
		
		var singleAccess = new SingleAccess();
		
		$('#puzzleWrapper').css("background-image", 'url("'+ imgSource + '")');

		var gridReady = new Promise(function (resolve,reject) {
				singleAccess.buildPuzzle(4, "#puzzleWrapper", "grid", "yellow", "gridPiece");
				resolve("ready");
		});
		gridReady.then(function(fulfilled){
			
			 $(".gridPiece").each(function(n){
				for(var i=0; i < 4; i++){
					singleAccess.buildPuzzle(3, '#grid'+ n + i, "puzzletile" + n + i, "blue", "puzzlePiece");
				}
			}); 
			
			
			$('.gridPiece').each(function() {
				$(this).attr("onclick", "colorDiv(this)");
			});
			
		});
		
		

		singleAccess.buildPuzzle(4, "#puzzleGridWrapper", "overgrid", "lime", "overallGridPiece");
		
		
		calculateWrapperSize(imgSource, "#puzzleWrapper");
		calculateWrapperSize(imgSource, "#puzzleGridWrapper");
		
		$$(window).on('resize',function(page){
			calculateWrapperSize(imgSource, "#puzzleWrapper");	
			calculateWrapperSize(imgSource, "#puzzleGridWrapper");			
		});	
		
	} 
	
	$(".overallGridPiece").click(function(event){
			 var coordinate = (event.target.id).toString().split("d");
			 $('.overallGridPiece:not(#'+ event.target.id + ')').toggle();
			 $('.gridPiece:not(#grid' + coordinate[1] + ')').toggle();
			 
			 //TODO: image Object nur einmal bauen und mit getter holen.
			 var imgObj = new Image();
			 imgObj.src = 'https://www.advopedia.de/var/advopedia/storage/images/news/kurios/tierische-vorladung-wenn-die-katze-vor-gericht-muss/151031-1-ger-DE/tierische-vorladung-wenn-die-katze-vor-gericht-muss_ng_image_full.jpg';
			 
			 cropImage (imgObj, 375, 175, 75, 75, 600, 600);
			
	});
	
	
	function calculateWrapperSize(imgURL, Element){
		var image = new Image();
		image.src = imgURL;
		image.onload = function(){
			var imgFormat = image.width / image.height;
			var elemHeight = $(Element).height();
			$(Element).css("width", elemHeight * imgFormat +"px");
		}
		delete(image);
	}
	
	function cropImage (imgObj, sourceStartX, sourceStartY, cutWidth, cutHeight,  imgWidth, imgHeight){
		var canvasA = document.createElement('canvas');
			canvasA.width = imgWidth;
			canvasA.height = imgHeight;

			var context = canvasA.getContext('2d');
			//		      (Bildobjekt,   X Koordinate, Y Koordinate, Breite, Höhe , startin CanvasX, startin CanvasY, canvasbreite, canvashöhe)
			context.drawImage(imgObj, sourceStartX, sourceStartY, cutWidth, cutHeight, 0, 0, imgWidth, imgHeight);
			
			$("#puzzleWrapper").append(canvasA);
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
                            '<div class="popup" id="my-popup">' +
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
				'<div class="popup">' +
				   '<div class="view">' +
						'<div class="page">' +
						  '<div class="navbar">' +
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
	 });

	}
	
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
	
	 $(".help").click(function () {               
			 //$(".popup").remove();
        var popup = app.popup.create({
				content:
				'<div class="popup">' +
				   '<div class="view">' +
						'<div class="page">' +
						  '<div class="navbar">' +
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
	 });
	
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

