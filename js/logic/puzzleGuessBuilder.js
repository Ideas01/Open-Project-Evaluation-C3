function PuzzleGuessBuilder() {}

PuzzleGuessBuilder.prototype.buildGuessButtons = function (contextId, puzzleImageData) {
    new Promise(function (resolve) {
        var switchedAnswers = switchAnswers(puzzleImageData[contextId].wrongAnswers, puzzleImageData[contextId].correctAnswer);

        var correctCategory = {
            category: puzzleImageData[contextId].category,
            answers: switchedAnswers,
            correctAnswer: puzzleImageData[contextId].correctAnswer
        };
        resolve(correctCategory);
    }).then(function (correctCategory) {
        appendCategories(puzzleImageData, correctCategory);
    });


};

function appendCategories(imageCategories,correctCategory) {
    $.each(imageCategories, function (index, data) {
        if ($('#' + data.category).length === 0) {
            $('#guessOverview').append('<a class="guessButton" id="' + data.category + '">' + data.category + '</a>');
        }
        else {
            console.log('ID: ' + data.category + ' already exists!');
        }
        $('#' + data.category).click(function (event) {
            console.log(event.target.id);
            fillCategories(event.target.id, correctCategory, imageCategories)
        });
    });
}

function fillCategories(clickedCategory, correctCategory, otherCategories) {
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
        console.log("the clicked category: " + clickedCategory);
        $('#guessItems').empty();
        for (var i = 0; i < otherCategories.length; i++) {
            console.log(otherCategories[i].category);
            if (otherCategories[i].category === clickedCategory) {
                console.log("hier bin ich richtig");
                $.each(otherCategories[i].wrongAnswers, function (index, data) {
                    $('#guessItems').append('<a class="guessButton" id="' + data + '">' + data + '</a>');
                    $('#' + data).click(function () {
                        checkGuessItem(data, correctCategory.correctAnswer);
                    })
                });
            }
        }
    }

}

function switchAnswers(wrongAnswers, correctAnswer) {
    var switchedAnswers = wrongAnswers;
    //calculate random index to switch with correct answer
    let randomIndex = Math.floor(Math.random() * wrongAnswers.length);
    //append at the end of the array
    if (randomIndex == wrongAnswers.length) {
        switchedAnswers.push(correctAnswer);
    } else {
        console.log("randomIndex: " + randomIndex);

        //save value at randomIndex to append it later
        let valueToSwitch = wrongAnswers[randomIndex];

        //switch value at randomIndex with correctAnswer
        switchedAnswers[randomIndex] = correctAnswer;

        //push swicht wrong answer back into array
        switchedAnswers.push(valueToSwitch);
    }
    return switchedAnswers;
}

function checkGuessItem(givenAnswer, correctAnswer) {
    if (givenAnswer === correctAnswer) {
        console.log("GIVEN ANSWER IS: " + givenAnswer);
        app.router.navigate('/success/');
    }
    else {
        console.log("GIVEN ANSWER IS: " + givenAnswer);
        app.router.navigate('/failure/');
    }
}
