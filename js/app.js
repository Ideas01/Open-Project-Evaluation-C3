var singleAccess = new SingleAccess();

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
		
		console.log("Tneu" + T);
		
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
			console.log(rangeSliderValues);
		});
    }
	

	
 	if(page.name === 'puzzle'){

		
		var windowWidth = window.screen.width;
		var windowHeight = window.screen.height;
	
	
		var imgObj = new Image();
		imgObj.src = "https://static.geo.de/bilder/17/d1/57813/facebook_image/meer-c-8977765.jpg";
		
		imgObj.onload = function(){
			var imgFormat = imgObj.width / imgObj.height;
			var puzzleWidth = parseInt($("#puzzleDiv").css("width"));		
			var height = puzzleWidth / imgFormat;
			$("#puzzleDiv").css("height", height);
			
			var singleAccess = new SingleAccess();
			singleAccess.buildPuzzle(12, "#puzzleDiv", "blue");
			//delete imgObj;
			singleAccess.buildPuzzle(4, "#gridDiv", "lime");
			
			
		}
	
		$$('window').on('resize', function(page){
			console.log("resize trigger")
			
			$("#puzzleDiv").empty();
			var imgObj = new Image();
			imgObj.src = "https://static.geo.de/bilder/17/d1/57813/facebook_image/meer-c-8977765.jpg";
			
			imgObj.onload = function(){
				var imgFormat = imgObj.width / imgObj.height;				
				var puzzleWidth = parseInt($("#puzzleDiv").css("width"));				
				var height = puzzleWidth / imgFormat;
				$("#puzzleDiv").css("height", height);			

				var singleAccess = new SingleAccess();
				
				singleAccess.buildPuzzle(12);
			}
			
		});	
		
	} 
	
if (page.name === 'P2'){
		imageArray.currentIndex = imageArray.startIndex;
		imageArray.maxIndex = imageArray.imageUrls.length -1;
		console.log("image-array: current index: " + imageArray.currentIndex);
		console.log("image-array: maxIndex:" + imageArray.maxIndex);

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
			console.log("bild:" + n );
			$("#swiper" +n).css('background-image',"url("+ getImageUrl(imageArray.imageUrls,n));
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

	}
	// {"query":"mutation cDevice {createDevice(data: {name: "Test1"}) {device {id name context {id} owners {id}} token}}"}
	// {"query":"mutation cDevice {createDevice(data: {name: \"Test1\"}) {device {id name context {id} owners {id}} token}}"}
	
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
			console.log("currentIndex nach dem back-click: " + imageArray.currentIndex);
		}
		else if(imageArray.currentIndex==0){
			console.log("mehr als 0 geht nicht");
		}
	});
	
	 $(".help").click(function () {               
			 $(".popup").remove();
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
    imageUrls:  ["./img/examples/PrototypBsp1.png", "./img/examples/PrototypBsp2.png", "./img/examples/PrototypBsp3.png"]
};

