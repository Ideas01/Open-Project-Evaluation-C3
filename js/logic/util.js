/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * util.js 
 * 
 * collection of utility functions for the .js logic
 * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
 class Util
 {
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * C O N S T R U C T O R   &   A T T R I B U T E S
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
 
	constructor(){}
 
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * F U N C T I O N S
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
 
	/**
	popUp()
	creates and shows a PopUp.
	
	parameters:
	- title: (string) title-caption for the popUp
	- content: (string) content with html code.
	
	returns:
	
 
	*/
	 popUp(title,content){
		var chk = new Checker("popUp");
		chk.isProperString(title,"title");
		chk.isProperString(content,"content");
		
		let popup = app.popup.create({
			content:
			'<div class="popup">' +
				'<div class="view">' +
					'<div class="page popupStartpage ">' +
						'<div class="navbar">' +
							'<div class="navbar-inner">' +
								'<div class="title">'+title+'</div>' +
								'<div class="right"></div>' +
							'</div>' +
						'</div>' +
						'<div class="page-content">' +
							content +
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
			 
	 }
	 
	 /**
	 nameSpaceIsAvailable()
	 checks if a namespace is available
	 
	 parameters:
	 - nameSpace: (string) identifier of the namespace
	 
	 returns:
	 - (bool): true when nameSpace is available.
	 */
	 nameSpaceIsAvailable(nameSpace){
		if(document.querySelector("#" + nameSpace) != null){
			return false;
		}else{
			return true;
		}
	 }
	 
	/**
	listAllKeys()
	analysis an js-objects and returns an array with all kexs.
	
	paramters:
	obj - (JS-Object) object that shall be analysed
	*/
	listAllKeys(obj) {
		var chk = new Checker("listAllKeys");
		chk.isValid(obj,"obj");
		
		var objectToInspect;     
		var result = [];
		
		for(objectToInspect = obj; objectToInspect !== null; objectToInspect = Object.getPrototypeOf(objectToInspect)) {  
		  result = result.concat(Object.keys(objectToInspect));  
		}
		
		return result; 
	}
	
	/**
	isLandscape()
	
	
	returns:
	(bool) app is in landscape mode
	*/
	isLandscape(){
		if ($(window).width() >= $(window).height()){
			console.log("yup");
			 return true;
		}else{
			console.log("nö");
			return false; 
		}
	}
	 
	 
 }