
var sliderValues = [];

    $('document').ready(function () {
        var buttonText = "Bewertung abschicken";

        //test-data
        var testDataObj = {
            questionCount: 4,
            headerArray: [
                "Frage1", "Frage2", "Frage3", "Frage4", "Frage5"
            ]
        };

        var singleAccess = new SingleAccess();
		
        var sliderIDs = singleAccess.createRangeSliders(testDataObj.questionCount, testDataObj.headerArray);

        function makeButton(buttonText) {
            var newButton = document.createElement("button");
            newButton.id = "sendButton";
            newButton.onclick = function () {
                saveValues();
            };
            var textNode = document.createTextNode(buttonText);
            newButton.appendChild(textNode);
            $('.page-content').append(newButton);

            return newButton.id;
        }

        var buttonID = makeButton(buttonText);

        function saveValues() {
            var length = sliderIDs.length;
            for (var i = 0; i < length; i++) {
                var slider = document.getElementById(sliderIDs[i]);
                sliderValues[i] = slider.value;
                console.log(slider.id + ": " + "value is " + sliderValues[i]);
            }
            return sliderValues;
        }

        $(window).resize(function () {
            var newSliderValues = saveValues();
            console.log(newSliderValues);
            console.log("Die slider ID ist: " + sliderIDs);
           //sliderIDs.empty();

            $(".page-content").empty();
            var newSliderIDs = singleAccess.createRangeSliders(testDataObj.questionCount, testDataObj.headerArray);

            var length = newSliderIDs.length;

            for(var i=0; i< length;i++){
                var slider = document.getElementById(newSliderIDs[i]);
                slider.value = newSliderValues[i];
            }
            makeButton(buttonText);
        })
    });

