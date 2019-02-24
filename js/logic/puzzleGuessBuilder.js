/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * puzzleGuess.js 
 * 
 * .
 * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
class PuzzleGuessBuilder{
	
	
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * C O N S T R U C T O R   &   A T T R I B U T E S
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
 
	constructor(url){ 
		this.serverAdresse = url; // url for accessing the back-end (e.g. 'http://localhost:3000/' or 'http://192.168.43.174:3000/')
	}
	
	
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * F U N C T I O N S
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */


	/**
	 *
	 * Appends the categories to the container guessOverview and calls function setClickHandler
	 *
	 * @param imageCategories categories to append to guessOverview
	 */

	 appendCategories(DOMelement, imageCategories, callback) {
	    var promises = [];
		$.each(imageCategories, function (index, data) {
			var promise = new Promise(function(resolve, reject){
				if ($('#' + data.category).length === 0) {
					$(DOMelement).append('<a class="guessButton" id="' + data.category + '">' + data.category + '</a>');
					promises.push(promise);
					
					if('#' + data.category){
						resolve(0);
					}
				}
				else {
					console.log('ID: ' + data.category + ' already exists!');
					resolve(0);
				}
			});
	    });
		Promise.all(promises).then(function(){
			callback(0);
		});
	};


	/**
	 *
	 * fills the clicked category with items and and appends a click handler which calls function checkGuessItems
	 *
	 * @param clickedCategory name of the clicked category
	 * @param correctCategory the category which contains the correct answer
	 * @param puzzleImageData the complete object with all available categories
	 */

	 buildCategories(DOMelement, clickedCategory, puzzleImageID, puzzleImageData, callback) {
		var thisisme = this;

		thisisme.getCorrectCategory(puzzleImageID, puzzleImageData, function(correctCategory){
			
				$(DOMelement).empty();
				var promises = [];
				var loopPromise = new Promise(function(resolve, reject){
				for (var i = 0; i < puzzleImageData.length; i++) {

						if (puzzleImageData[i].category === clickedCategory) {
							$.each(puzzleImageData[i].wrongAnswers, function (index, data) {
								if($('#' + data).length == 0) {
									$(DOMelement).append('<a class="guessButton" id="' + data + '">' + data + '</a>');
									console.log("children", data)
									promises.push(loopPromise);
//									$('#' + data).click(function () {
//										console.log("grrr");
//										thisisme.checkGuessItem(data, correctCategory.correctAnswer);
//									});
									if($('#' + data)){
										resolve(true);	
									}
								}
								else{
									console.log('Die ID ' + data + ' ist schon vergeben');
									resolve(true);
								}
							});

						}
					}
				});
				
				puzzleImageData["correctCategory"] = correctCategory; 
	
				Promise.all(promises).then(function(){
					callback(puzzleImageData);
				});
				
		});


	};
	
	getCorrectCategory(puzzleImageID, puzzleImageData, callback){
	var thisisme = this;
		var switchedAnswers = thisisme.switchAnswers(puzzleImageData[puzzleImageID].wrongAnswers, puzzleImageData[puzzleImageID].correctAnswer);
		var correctCategory = {
			category: puzzleImageData[puzzleImageID].category,
			answers: switchedAnswers,
			correctAnswer: puzzleImageData[puzzleImageID].correctAnswer
		};
		callback(correctCategory);
	};

	/**
	 *
	 * switches one wrong answer with the correct answer of an puzzle image.
	 * The switched wrong answer is appended to the rest of the answers
	 *
	 * @param wrongAnswers Array containing the wrong answers
	 * @param correctAnswer the correct answer of the category
	 * @returns {Array} Array containing the wrong answers and the correct answer
	 */

	switchAnswers(wrongAnswers, correctAnswer) {
	    var switchedAnswers = wrongAnswers;
	    //calculate random index to switch with correct answer
	    let randomIndex = Math.floor(Math.random() * wrongAnswers.length);
	    //append at the end of the array
	    if (randomIndex == wrongAnswers.length) {
	        switchedAnswers.push(correctAnswer);
	    } else {
	        //save value at randomIndex to append it later
	        let valueToSwitch = wrongAnswers[randomIndex];

	        //switch value at randomIndex with correctAnswer
	        switchedAnswers[randomIndex] = correctAnswer;

	        //push switcht wrong answer back into array
	        switchedAnswers.push(valueToSwitch);
	    }
	    return switchedAnswers;
	};

	/**
	 *
	 * checks if the user clicked the correct item and navigates
	 * to the correct page for a correct or wrong answer
	 *
	 * @param givenAnswer the item the user selected
	 * @param correctAnswer the correct answer of the category
	 */

	checkGuessItem(givenAnswer, correctAnswer) {
	    if (givenAnswer === correctAnswer) {
	        app.router.navigate('/success/');
	    }
	    else {
	        app.router.navigate('/failure/');
	    }
	};
}