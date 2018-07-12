$('document').ready(function () {
<<<<<<< HEAD
<<<<<<< HEAD
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
	
	$(window).resize(function(){
	
	$(".puzzleDiv").empty();
	
	var imgObj = new Image();
    imgObj.src = "http://image.wallpaperlistings.com/bigphoto/97/971504/wallpaper-1920x1080-hd-1080p.jpg";
    
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

=======
	
=======
>>>>>>> Puzzle
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
	
	$(window).resize(function(){
	
	$(".puzzleDiv").empty();
	
<<<<<<< HEAD
>>>>>>> Puzzle
=======
	var imgObj = new Image();
    imgObj.src = "http://image.wallpaperlistings.com/bigphoto/97/971504/wallpaper-1920x1080-hd-1080p.jpg";
    
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

>>>>>>> Puzzle
});