/**
 *
 * Builds a range slider element and returns it
 *
 */

var app = new Framework7({

});

function SliderFactory() {}


SliderFactory.prototype.createRangeSliders = function (questionCount) {

    for (var i = 1; i <= questionCount; i++) {
        var newSlider = document.createElement('input');
        newSlider.id = 'slider' + i;
        newSlider.className = "slider";
        newSlider.type = 'range';
        newSlider.min = "0";
        newSlider.max = "10";
        newSlider.value = "0";
        newSlider.step = "1";


        //add Element to the dom
        $('.sliderDiv').append(newSlider);
    }
    //add onchange Method
    $('.slider').each(function() {
        $(this).attr("onchange", "returnValue(this)");
    })

};

function returnValue(element) {
    console.log("Der Wert von " + element.id + " ist " + element.value);
    return element.value;

}




/**
 //string for a standard range slider
 var sliderString = "<input type='range' class='slider' min='0' max='10' step='1' value='5' onchange=''>";

 //create a range slider for every question in the survey
 var rangeSliders = [];
 for (var i = 1; i <= questionCount; i++) {
        rangeSliders.push(sliderString);
    }

 return rangeSliders; **/

/**var rangeSlider = app.range.create({
    el: '.range slider',
    on: {
        change: function () {
            console.log("hallo i bims")
        }
    },
    min: '0',
    max: '5',
    step: '1',
    value: '0',
    draggableBar: 'true' **/