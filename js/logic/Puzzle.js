$('document').ready(function () {
    var windowWidth = window.screen.width;
    var windowHeight = window.screen.height;
	
	
	var imgObj = new Image();
    imgObj.src = "https://ze.tt/wp-content/uploads/2017/01/meer3-e1485169056783-1024x577.jpg";
    
	imgObj.onload = function(){
		var imgFormat = imgObj.width / imgObj.height;
        console.log("formatle: "+ imgFormat)
		var puzzleWidth = parseInt($(".puzzleDiv").css("width"));		
		var height = puzzleWidth / imgFormat;
		$(".puzzleDiv").css("height", height);
	

		var singleAccess = new SingleAccess();
		\console.log("noch nicht weg")
		singleAccess.buildPuzzle(12);
		delete imgObj;
		
	}
	
	$(window).resize(function(){
	
<<<<<<< HEAD
		$(".puzzleDiv").empty();
=======
	$(".puzzleDiv").empty();
	
	var imgObj = new Image();
    imgObj.src = "https://ze.tt/wp-content/uploads/2017/01/meer3-e1485169056783-1024x577.jpg";
    
	imgObj.onload = function(){
		var imgFormat = imgObj.width / imgObj.height;
        console.log("formatle: "+ imgFormat)
>>>>>>> fix-puzzle
		
		var imgObj = new Image();
		imgObj.src = "https://static.geo.de/bilder/17/d1/57813/facebook_image/meer-c-8977765.jpg";
    
		imgObj.onload = function(){
			var imgFormat = imgObj.width / imgObj.height;
			console.log("formatle: "+ imgFormat)
			
			var puzzleWidth = parseInt($(".puzzleDiv").css("width"));
			console.log("puzzlewidth: " + puzzleWidth);
			
			var height = puzzleWidth / imgFormat;
			console.log("doof: "+ height)
			$(".puzzleDiv").css("height", height);
			console.log("versuch: "+ $(".puzzleDiv").css("height"))
			
		

			var singleAccess = new SingleAccess();
			
			singleAccess.buildPuzzle(12);
			
		}	
	});	

});