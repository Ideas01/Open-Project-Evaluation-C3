/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * swiperfactory.js 
 * 
 * creates new swipers for framework 7
 *
 * required files:
 * - util.js
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

class SwiperFactory
{
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * C O N S T R U C T O R   &   A T T R I B U T E S
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
	constructor(){
		this.util = new Util();
		this.currentContextIdIndex = -1;
	}
	
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * F U N C T I O N S
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */	
	/**
	*   initializeSwiper()
	*	creates a new slider
	*
	*
	***********************************************************/
	initializeSwiper(){
		new Swiper('.swiper-container', {
			spaceBetween: 100
		});
	};
	
	/**
	*   getCurrentContextIdIndex()
	*	returns (number) 
	*
	*
	***********************************************************/
	getCurrentContextIdIndex(){
		return this.currentContextIdIndex;
	};
	
	/**
	*   initializeSwiper()
	*	resets the current ContextID
	*
	*
	***********************************************************/
	resetCurrentContextId(){
		this.currentContextIdIndex = -1;
	}
	
	/**
	*   buildSwiper()
	*	build a new swiper out of components.
	*
	*	parameters:
	*	- maxContentPerSwiper: (int) amount of contents (from contentArray) which have to displayed in a single "swipe"
	*   - swipperWrapperId: (string) identifier for the swiperWrapper.
	*	- nameSpace: (string) new namespace (has to be available!) for the swiper.
	*	- type: (string) type of swiper - there are IMAGESWIPER (contentArray consists of picture url's) and CONTENTSWIPER (see parameter contentArray)
	*	- contentArray: (array) - either string array with picture url's or when type is CONTENTSWIPER:
	*    [{
	*	    id: "elementId", // the name of the id   or     
	*		class: "elementClassName", // the name of the Class  !important: id will be prioritized
	*		newContent: "content" //the content to fill the tags with
	*    },{},...]
	*
	*	returns:
	*	new swiper element
	***********************************************************/


	buildSwiper(maxContentPerSwiper, swiperWrapperId, nameSpace, type, contentArray) {
		var chk = new Checker("buildSwiper");
		chk.isValidType(maxContentPerSwiper,"maxContentPerSwiper",'number');
		chk.isProperString(swiperWrapperId,"swiperWrapperId");
		chk.isProperString(nameSpace,"nameSpace");
		chk.isProperString(type,"type");
		chk.isValid(contentArray,"contentArray");
		chk.checkNonEmptyArray(contentArray,"contentArray");
		
		var thisisme = this;
		if(this.util.nameSpaceIsAvailable(nameSpace)){
			var keysArray = this.util.listAllKeys(contentArray[0]); //there has to be min. 1 entry. 
			var counter = 0;
			var contextId = null;
			var swiperElement = document.querySelector('#' + swiperWrapperId).swiper;
			console.log("swiperE")
			console.log(contentArray)
			$('.swiper-wrapper').empty();
			var swiperCount = calculateSwiperCount(contentArray.length, maxContentPerSwiper);
			console.log("jetzt sind es: " + contentArray.length)
			for (var i=0; i < swiperCount; i++){
				
				swiperElement.appendSlide('<div class="swiper-slide" id="'+ nameSpace + i + '"></div>');
				
				switch(type.toUpperCase()) {
					case "IMAGESWIPER": 
						//do sth.
						$("#" + nameSpace + i).css({
							'background-image': 'url("' + contentArray[i] +'")',
							'background-size': 'contain',
							'background-repeat' : 'no-repeat',
							'background-position': 'center' 
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
						if(counter < contentArray.length){
							$("#"+ nameSpace + i).append('<div id="'+ nameSpace + m + counter + '"></div>');
							console.log("element " + nameSpace + m + counter + "angehangen.")
							
							$('#' +  nameSpace + m + counter)[0].contextId = counter;
							
							$('#' +  nameSpace + m + counter).addClass(nameSpace);
							
							$('.'+ nameSpace).css('cursor','pointer');
							
							
							$('#' +  nameSpace + m + counter).click(function(event){
								var target = event.target.id.toString();
								$('#'+ target).css({'border': 'solid 1px #ffb380', 'width': '44%'});
							$('.' + nameSpace).not('#'+ target).css({'border': 'none', 'width': '44%'});
								contextId = event.target.contextId;
								thisisme.currentContextIdIndex = event.target.contextId;
							});
							
							$("#"+ nameSpace + m + counter).css({
								'position': 'relative',
								'display': 'flex',
								'margin': '1%',
								'align-content':'center',
								'width': contentWidth + '%', 
								'height': contentHeight + '%',
								'padding-left': '3%',
								'padding-top': '3%'
							});	
							
							$('.'+ nameSpace).css('cursor', 'pointer');
							$("."+ nameSpace).children().css('pointer-events', 'none');
							
							if(m < contentArray.length){						
								keysArray.forEach(function(key, keyIndex, keysArray){
									$("#"+ nameSpace + m + counter ).append(contentArray[counter][key]);
									$('#'+ nameSpace + m + counter).children().css('pointer-events', 'none');
								});
							}
							
						
						counter ++;
						}
					}
											
						swiperArray.push([nameSpace + i]);
						swiperElement.id = swiperArray;
						break;
					default:
					console.log("element nicht mehr gefunden")
					
				}
			}
		
		
		
		
		
		}else{
			throw "namespace: '" + nameSpace + "' is not available!";
		}
		return swiperElement;
	}





	/**
	setHandler()
	adds the event handlers to a swiper
	
	parameter:
	- mySwiper: (swiper) swiper 
	
	returns:
	
	*/

	setHandler(mySwiper) {
		var chk = new Checker("setHandler");
		chk.isValid(mySwiper,"mySwiper");
		var thisisme = this;
		mySwiper.on('slidePrevTransitionStart', function () {
			mySwiper.off('slideNextTransitionEnd');
		});

		  mySwiper.on('touchEnd', function () {
				if (mySwiper.isEnd) {
					mySwiper.on('slideNextTransitionEnd', function () {
						$(".popup").remove();
						let content = 	'<div class="block">' +
											'<p>Vielen Dank! Du hast dir alle Seiten des Prototypen angeschaut. </p>' +
											'<div class="next" text-align="center">' +
												'<div class="twoButtons">' +
												'<a href="#" class="button link popup-close" id="left-Btn"> Zurück </a>' +
												'<a href="/sliders/" class="button" id="right-Btn"> Weiter </a>' +
											'</div>' +
										'</div>'
						thisisme.util.popUp('Dankeschön',content);
					});
				}
			});
	};

}
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * END CLASS DEFINITION
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */	
 
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * I N T E R N A L - F U N C T I O N S
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */	
/**
calculateSwiperCount()
computes the amount of needed swipers

parameters:
- contextCount: (int) total amount of contexts (which shall be displayed in swipers)
- contextPerPage: (int) amount of contexts that shall be displayed on a single swiper

returns:
(int) number of needed swipers.
*/
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
         return Math.ceil(contextCount/contextPerPage);
    }
    return 0;
} 


