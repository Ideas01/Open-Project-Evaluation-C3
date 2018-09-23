function SwiperFactory() {}


SwiperFactory.prototype.initializeSwiper = function () {
    new Swiper('.swiper-container', {
        spaceBetween: 100
    });
};



/** elementsArray needs to have the following specs: 
*   [{
*	    id: "elementId", // the name of the id   or     
*		class: "elementClassName", // the name of the Class  !important: id will be prioritized
*		newContent: "content" //the content to fill the tags with
*    },{},...]
***********************************************************/


SwiperFactory.prototype.buildSwiper = function (maxContentPerSwiper, nameSpace, type, contentArray) {
	if(nameSpaceIsAvailable()){
		var keysArray = listAllKeys(contentArray[0]);
		var counter = 0;
		var swiperElement = document.querySelector('#' + nameSpace).swiper;
		
		
		var swiperCount = calculateSwiperCount(contentArray.length, maxContentPerSwiper);
			swiperCount = Math.ceil(swiperCount);
		
		for (var i=0; i < swiperCount; i++){
			console.log("element gefunden")
			
			swiperElement.appendSlide('<div class="swiper-slide" id="'+ nameSpace + i + '"></div>');
			
			switch(type.toUpperCase()) {
				case "IMAGESWIPER": 
					//do sth.
					$("#" + nameSpace + i).css({
						'background-image': 'url("' + contentArray[i] +'")',
						'background-size': "contain",
						'background-repeat' : "no-repeat",
					});
					break;
				case "CONTENTSWIPER": 
					let swiperArray =[];
					var contentWidth = 100;
					var contentHeight = 95;
					if(contentArray.length == 1) {}/*use default values.*/
					if(maxContentPerSwiper > 3 && contentArray.length > 3){
						 console.log("mehr als 3")
						 contentWidth = contentWidth / (Math.round(maxContentPerSwiper/2)) - 5;
						 contentHeight = contentHeight/2 - 5;
						 console.log(contentHeight)
					} else if(maxContentPerSwiper == 3 || contentArray.length == 3){
						 contentWidth = 45;
						 contentHeight = contentHeight/ 2;
					} else if(maxContentPerSwiper == 2 || contentArray.length == 2){
						 contentWidth = 45;
					}
					
				$("#" + nameSpace + i).css("height", "70%");
				
				
				for(var m = 0; m < maxContentPerSwiper; m++){
						$("#"+ nameSpace + i).append('<div id="'+ nameSpace + m + i + 'Div"></div>');
						console.log("element " + nameSpace + i + "angehangen.")
						$("#"+ nameSpace + m + i + 'Div').css({
							'position': 'relative',
							'display': 'inline-block',
							//'background-color': "lime",
							'margin': '1%',
							'align-content':'center',
							'width': contentWidth +'%', 
							'height': contentHeight + '%',
							'padding-left': '3%',
							'padding-top': '3%'							
						});	
						if(m < contentArray.length){
							
							console.log("keys")
							console.log(keysArray)
							
							keysArray.forEach(function(key, keyIndex, keysArray){
								$("#"+ nameSpace + m + i + 'Div').append(contentArray[counter][key]);
								console.log("keys content")
								console.log(contentArray[m][key])
							});
						}
						
						
					counter ++;
				}
				
					// $("#"+ nameSpace + i).css('margin', '1%');
					// $("#"+ nameSpace + i).css('align-content', 'center');
					// $("#"+ nameSpace + i).css(' height', '90%');
										
					swiperArray.push([nameSpace + i]);
					swiperElement.id = swiperArray;
					break;
				default:
				console.log("element nicht mehr gefunden")
			}
		}
	
	
	
	
	
	}else{
		//TODO: throw exception.
	}
	return swiperElement;
}


function listAllKeys(obj) {
	var objectToInspect;     
	var result = [];
	
	for(objectToInspect = obj; objectToInspect !== null; objectToInspect = Object.getPrototypeOf(objectToInspect)) {  
	  result = result.concat(Object.keys(objectToInspect));  
	}
	
	return result; 
}

function nameSpaceIsAvailable(nameSpace){
	if(document.querySelector("#" + nameSpace) != null){
		console.log("nope")
		return false;
	}else{
		console.log("yau")
		return true;
	}
}





SwiperFactory.prototype.setHandler = function (mySwiper) {
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
                    '<div style="margin: 0 auto;width: 510px;">' +
                    '<a href="#" class="button link popup-close" style="float: left; margin-right: 10px;"> Zurück </a>' +
                    '<a href="/sliders/" class="button"> Weiter </a>' +
                    '</div>' +
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
};


function calculateSwiperCount(contextCount, contextPerPage) {
    //is there a context to display and can the contexts be displayed on one swiper?
    if (contextCount > 0 && contextCount <= contextPerPage )
    {
        //only one swiper is necessary to display all contexts
        return 1;
    }
    let count = contextCount % contextPerPage;
    if(count === 0){
        //all swipers display four contexts
        return contextCount/contextPerPage;
    }
    else if(count > 0){
        //there is one swiper which does not display four contexts
         return Math.floor(contextCount/contextPerPage +1);
    }
    return 0;
}
