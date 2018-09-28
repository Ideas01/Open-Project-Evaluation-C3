/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * popop.js 
 * 
 * Containing a function for fast and easy creating and showing popups with Framework 7
 * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
 class PopUp
 {
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * C O N S T R U C T O R   &   A T T R I B U T E S
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
 
 // NONE
 
 /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * F U N C T I O N S
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
 
	 show(message,caption)
	 {
		 if(currentContextId == null){
				 let popup = app.popup.create({
					content:
					'<div class="popup">' +
						'<div class="view">' +
							'<div class="page popupStartpage ">' +
								'<div class="navbar">' +
									'<div class="navbar-inner">' +
										'<div class="title">Kein Prototyp gewählt</div>' +
										'<div class="right"></div>' +
									'</div>' +
								'</div>' +
								'<div class="page-content">' +
									'<div class="block">' +
										'<p>'+ message+'</p>' +
										'<a href="#" class="popup-close" >' +
											'<a class="button popup-close"> '+caption+' </a>' +
										'</a>' +
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
			 } else{
				 singleAccess.updateDeviceContext(contextList[currentContextIdIndex], deviceName);
			 }
	 }
 }