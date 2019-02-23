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
        appendCategories(puzzleImageData, correctCategory);
    });
};

PuzzleGuessBuilder.prototype.buildCategory = function (correctAnswer, wrongAnswers) {
    buildCategory(correctAnswer, wrongAnswers);
};

/**
 *
 * Appends the categories to the container guessOverview and calls function setClickHandler
 *
 * @param imageCategories categories to append to guessOverview
 * @param correctCategory category which contains the correct answer. Is needed for the clickHandler
 */

function appendCategories(imageCategories,correctCategory) {
    $.each(imageCategories, function (index, data) {
        if ($('#' + data.category).length === 0) {
            $('#guessOverview').append('<a class="guessButton" id="' + data.category + '">' + data.category + '</a>');
        }
        else {
            console.log('ID: ' + data.category + ' already exists!');
        }
    });
    setClickHandler(correctCategory,imageCategories);
}

/**
 *
 * sets a click handler on every appended category. This click handler calls function buildCategories
 *
 * @param correctCategory category which cointains the correct answer.
 * @param imageCategories
 */
function setClickHandler(correctCategory,imageCategories) {
    $('#guessOverview').children().click(function (event) {
        buildCategories(event.target.id, correctCategory, imageCategories)
    })

}

/**
 *
 * fills the clicked category with items and and appends a click handler which calls function checkGuessItems
 *
 * @param clickedCategory id of the clicked category
 * @param correctCategory the category which contains the correct answer
 * @param otherCategories other categories with wrong answers
 */

function buildCategories(clickedCategory, correctCategory, otherCategories) {
    if (clickedCategory === correctCategory.category) {
        $('#guessItems').empty();
        $.each(correctCategory.answers, function (index, data) {
            $('#guessItems').append('<a class="guessButton" id="' + data + '">' + data + '</a>');
            $('#' + data).click(function () {
                checkGuessItem(data, correctCategory.correctAnswer);
            });
        });
    }
    else {
        $('#guessItems').empty();
        for (var i = 0; i < otherCategories.length; i++) {
            if (otherCategories[i].category === clickedCategory) {
                $.each(otherCategories[i].wrongAnswers, function (index, data) {
                    if($('#' + data).length ==0) {
                        $('#guessItems').append('<a class="guessButton" id="' + data + '">' + data + '</a>');
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

function buildCategory(puzzleImageData, category)
{
    let allAnswers = [];
    for(let i = 0; i < puzzleImageData.length; i++)
    {
        if(puzzleImageData[i].category === category)
        {
            console.log("Found category" + category);
            for(let j = 0; j < puzzleImageData[i].wrongAnswers.length; j++)
            {
                if(allAnswers.indexOf(puzzleImageData[i].wrongAnswers[j]) === -1)
                {
                    allAnswers.push(puzzleImageData[i].wrongAnswers[j])
                }
            }
        }
    }

    console.log(allAnswers);
    /*
    let allAnswers = [];
    allAnswers.push(correctAnswer);
    for (let i=0; i < wrongAnswers.length; i++)
    {
        allAnswers.push(wrongAnswers[i]);
    }
    console.log(allAnswers);
    $.each(allAnswers, function (index, data) {
        $('#guessItems').append('<a class="guessButton" id="' + data + '">' + data + '</a>');
    })
*/
}

function hideGuessItem(clickedItems) {

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
