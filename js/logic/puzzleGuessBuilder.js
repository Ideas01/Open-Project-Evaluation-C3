function PuzzleGuessBuilder() {}


/**
 *
 *  Uses puzzleImageData to build the categories
 *
 * @param puzzleImageID ID of the correct PuzzleImage
 * @param puzzleImageData data of all the available puzzle images
 */
PuzzleGuessBuilder.prototype.buildCategories = function (puzzleImageID, puzzleImageData) {
    new Promise(function (resolve) {
        var switchedAnswers = switchAnswers(puzzleImageData[puzzleImageID].wrongAnswers, puzzleImageData[puzzleImageID].correctAnswer);

        var correctCategory = {
            category: puzzleImageData[puzzleImageID].category,
            answers: switchedAnswers,
            correctAnswer: puzzleImageData[puzzleImageID].correctAnswer
        };
        resolve(correctCategory);
    }).then(function (correctCategory) {
        appendCategories(puzzleImageData, function(){
			setClickHandler(correctCategory, puzzleImageData);
		});
		
    });
};

/**
 *
 * Appends the categories to the container guessOverview and calls function setClickHandler
 *
 * @param imageCategories categories to append to guessOverview
 */

function appendCategories(imageCategories, callback) {
    var promises = [];
	$.each(imageCategories, function (index, data) {
		var promise = new Promise(function(resolve, reject){
			if ($('#' + data.category).length === 0) {
				$('#guessOverview').append('<a class="guessButton" id="' + data.category + '">' + data.category + '</a>');
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
	
	callback(Promise.all(promises));
}

/**
 *
 * sets a click handler on every appended category. This click handler calls function buildCategories
 *
 * @param correctCategory category which contains the correct answer.
 * @param otherCategories category which contains the wrong answers.
 */
function setClickHandler(correctCategory, otherCategories) {
    $('#guessOverview').children().click(function (event) {
        buildCategories('#guessItems', event.target.id, correctCategory, otherCategories)
    })

}

/**
 *
 * fills the clicked category with items and and appends a click handler which calls function checkGuessItems
 *
 * @param clickedCategory name of the clicked category
 * @param correctCategory the category which contains the correct answer
 * @param otherCategories the complete object with all available categories
 */

function buildCategories(DOMelement, clickedCategory, correctCategory, otherCategories) {
    if (clickedCategory === correctCategory.category) {
        $(DOMelement).empty();
        $.each(correctCategory.answers, function (index, data) {
            $(DOMelement).append('<a class="guessButton" id="' + data + '">' + data + '</a>');
            $('#' + data).click(function () {
                checkGuessItem(data, correctCategory.correctAnswer);
            });
        });
    }
    else {
        $(DOMelement).empty();
        for (var i = 0; i < otherCategories.length; i++) {
            if (otherCategories[i].category === clickedCategory) {
                $.each(otherCategories[i].wrongAnswers, function (index, data) {
                    if($('#' + data).length ==0) {
                        $(DOMelement).append('<a class="guessButton" id="' + data + '">' + data + '</a>');
                        $('#' + data).click(function () {
                            checkGuessItem(data, correctCategory.correctAnswer);
                        })
                    }
                    else{
                        console.log('Die ID ' + data + ' ist schon vergeben');
                    }
                });

            }
        }
    }

}

/**
 *
 * switches one wrong answer with the correct answer of an puzzle image.
 * The switched wrong answer is appended to the rest of the answers
 *
 * @param wrongAnswers Array containing the wrong answers
 * @param correctAnswer the correct answer of the category
 * @returns {Array} Array containing the wrong answers and the correct answer
 */

function switchAnswers(wrongAnswers, correctAnswer) {
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

        //push swicht wrong answer back into array
        switchedAnswers.push(valueToSwitch);
    }
    return switchedAnswers;
}

/**
 *
 * checks if the user clicked the correct item and navigates
 * to the correct page for a correct or wrong answer
 *
 * @param givenAnswer the item the user selected
 * @param correctAnswer the correct answer of the category
 */

function checkGuessItem(givenAnswer, correctAnswer) {
    if (givenAnswer === correctAnswer) {
        app.router.navigate('/success/');
    }
    else {
        app.router.navigate('/failure/');
    }
}
