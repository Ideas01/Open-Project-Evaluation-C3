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
      },
      // Demo products for Catalog section
      products: [
        {
          id: '1',
          title: 'Apple iPhone 8',
          description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi tempora similique reiciendis, error nesciunt vero, blanditiis pariatur dolor, minima sed sapiente rerum, dolorem corrupti hic modi praesentium unde saepe perspiciatis.'
        },
        {
          id: '2',
          title: 'Apple iPhone 8 Plus',
          description: 'Velit odit autem modi saepe ratione totam minus, aperiam, labore quia provident temporibus quasi est ut aliquid blanditiis beatae suscipit odio vel! Nostrum porro sunt sint eveniet maiores, dolorem itaque!'
        },
        {
          id: '3',
          title: 'Apple iPhone X',
          description: 'Expedita sequi perferendis quod illum pariatur aliquam, alias laboriosam! Vero blanditiis placeat, mollitia necessitatibus reprehenderit. Labore dolores amet quos, accusamus earum asperiores officiis assumenda optio architecto quia neque, quae eum.'
        },
      ]
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
	if(page.name === 'puzzle'){
		app.popup.close();
		
		var windowWidth = window.screen.width;
		var windowHeight = window.screen.height;
	
	
		var imgObj = new Image();
		imgObj.src = "http://image.wallpaperlistings.com/bigphoto/97/971504/wallpaper-1920x1080-hd-1080p.jpg";
    
		imgObj.onload = function(){
			var imgFormat = imgObj.width / imgObj.height;
			console.log("formatle: "+ imgFormat)
			var puzzleWidth = parseInt($(".puzzleDiv").css("width"));		
			var height = puzzleWidth / imgFormat;
			$(".puzzleDiv").css("height", height);
	

			var singleAccess = new SingleAccess();
		
			singleAccess.buildPuzzle(12);
			delete imgObj;
		
		}
	
		$$('window').on('resize', function(page){
			console.log("resize trigger")
	
			$(".puzzleDiv").empty();
	
			var imgObj = new Image();
			imgObj.src = "http://image.wallpaperlistings.com/bigphoto/97/971504/wallpaper-1920x1080-hd-1080p.jpg";
			
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
	
	/* if (page.name === 'P2'){
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

		$(".try").append(imageDiv);
		console.log("Ausführung beendet");
	}
	

	//add click functionality for the right(next) chevron
	$(".next-link").click(function () {
		if(imageArray.currentIndex < imageArray.maxIndex){
			imageDiv.style.backgroundImage = "url(" + getImageUrl(imageArray.imageUrls,++imageArray.currentIndex) + ")";
			console.log("currentIndex nach next-click: " + imageArray.currentIndex);
		}
		else if(imageArray.currentIndex == imageArray.maxIndex){
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
							  '<a href="/puzzle/" class="button"> Weiter </a>' +
						  '</div>' +
						'</div>' +
					  '</div>' +
					'</div>' +
				  '</div>' +
				'</div>',
				on: {
					opened: function () {
					console.log('Popup opened')
					}
				}
			});
			console.log("Popup instance: " + popup.el);
			app.popup.open(popup.el,true);
		console.log("prototyp zuende");
		}
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
	}); */
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

//js Object, which contains all necessary attributes
var imageArray = {
    imageUrls:  ["https://thumbnails-visually.netdna-ssl.com/the-10-commandments-of-user-interface-design_553e21765c690_w1500.png",
        "https://weandthecolor.com/wp-content/uploads/2017/05/User-Interface-designs-by-Balraj-Chana-1068x591.jpg",
        "https://cdn-images-1.medium.com/max/2000/1*_tkd0q6CFkepowjFZHRSSg.jpeg"],
    startIndex: 0,
    currentIndex: undefined,
    maxIndex: undefined,
};
