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

	if(page.name === 'sliders'){
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
		
        var sliderIDs = singleAccess.createRangeSliders(testDataObj.questionCount, testDataObj.headerArray);



        function saveValues() {
            var length = sliderIDs.length;
            for (var i = 0; i < length; i++) {
                var slider = document.getElementById(sliderIDs[i]);
                sliderValues[i] = slider.value;
                console.log(slider.id + ": " + "value is " + sliderValues[i]);
            }
            return sliderValues;
        }

		$("#bewertungBtn").click(function () {
			saveValues();
		});
		
        $(window).resize(function () {
            var newSliderValues = saveValues();
            console.log(newSliderValues);
            console.log("Die slider ID ist: " + sliderIDs);
           //sliderIDs.empty();

            $(".slider-page-content").empty();
            var newSliderIDs = singleAccess.createRangeSliders(testDataObj.questionCount, testDataObj.headerArray);

            var length = newSliderIDs.length;

            for(var i=0; i< length;i++){
                var slider = document.getElementById(newSliderIDs[i]);
                slider.value = newSliderValues[i];
            }
			
			$("#bewertungBtn").click(function () {
			saveValues();
		});
        })
	}
	

	
 	if(page.name === 'puzzle'){

		
		var windowWidth = window.screen.width;
		var windowHeight = window.screen.height;
	
	
		var imgObj = new Image();
		imgObj.src = "https://static.geo.de/bilder/17/d1/57813/facebook_image/meer-c-8977765.jpg";
		console.log("bis hierhin1");
		
		imgObj.onload = function(){
			var imgFormat = imgObj.width / imgObj.height;
			console.log("formatle: "+ imgFormat)
			var puzzleWidth = parseInt($(".puzzleDiv").css("width"));		
			var height = puzzleWidth / imgFormat;
			$(".puzzleDiv").css("height", height);
			
			var singleAccess = new SingleAccess();
			console.log("bis hierhin2");
			singleAccess.buildPuzzle(12);
			delete imgObj;
		
		}
	
		$$('window').on('resize', function(page){
			console.log("resize trigger")
			
			$(".puzzleDiv").empty();
			var imgObj = new Image();
			imgObj.src = "https://static.geo.de/bilder/17/d1/57813/facebook_image/meer-c-8977765.jpg";
			
			imgObj.onload = function(){
				var imgFormat = imgObj.width / imgObj.height;				
				var puzzleWidth = parseInt($(".puzzleDiv").css("width"));				
				var height = puzzleWidth / imgFormat;
				$(".puzzleDiv").css("height", height);			

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
                            }
                        });
                        app.popup.open(popup.el, true);
                    });
                }
        });
	}

	//add click functionality for the right(next) chevron
var versuch;
$(".next-link").click(function () {
		var query = `query gDevices {devices {id name}}`;
		fetch('http://localhost:3000/', {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'Authorization' : 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjllZmM3MTdjODM0Y2I4ZjVhZjAwYTQ4NTIxY2Q4ZTFmMzk3ZTMwNzMwMGFjOWM2ZTU1ZDAzOGJlNWI2ZGEwOWMiLCJ0eXBlIjoiZGV2aWNlIiwiaWF0IjoxNTM1NTQ2Nzg1fQ.Hoc9FrutCHxf_00YSu7e7JNYTNX7oLxM8G9eXkuD_-8'
		  },
		  body: JSON.stringify({
			query,
		  })
		})
		  .then(r => r.json())
		  .then(
			  data => console.log('data returned:', data),
			  console.log("erg:" + versuch)
		  );
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
});

// Init/Create views

var homeView = app.views.create('#view-home', {
  url: '/'
});

/*
var catalogView = app.views.create('#view-catalog', {
  url: '/catalog/'
});
var settingsView = app.views.create('#view-settings', {
  url: '/settings/'
}); */




/* // Login Screen Demo
$$('#my-login-screen .login-button').on('click', function () {
  var username = $$('#my-login-screen [name="username"]').val();
  var password = $$('#my-login-screen [name="password"]').val();

  // Close login screen
  app.loginScreen.close('#my-login-screen');

  // Alert username and password
  app.dialog.alert('Username: ' + username + '<br>Password: ' + password);
});
 */


	
// 
//## Für About ##
// 
function getImageUrl(urlArray, imageIndex)
{
    return urlArray[imageIndex];
}

//js Object, which contains all available prototype images
var imageArray = {
    imageUrls:  ["https://thumbnails-visually.netdna-ssl.com/the-10-commandments-of-user-interface-design_553e21765c690_w1500.png",
        "https://weandthecolor.com/wp-content/uploads/2017/05/User-Interface-designs-by-Balraj-Chana-1068x591.jpg",
        "https://cdn-images-1.medium.com/max/2000/1*_tkd0q6CFkepowjFZHRSSg.jpeg"],
    startIndex: 0,
    currentIndex: undefined,
    maxIndex: undefined,
};
