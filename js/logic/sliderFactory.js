
var app = new Framework7();

function SliderFactory() {}

var questionsPerPage = 4;

SliderFactory.prototype.createRangeSliders = function (questionCount, headers) {

    var rangeSliderArray=[];
    // three possible cases:
    //1: questionsPerPage = questionCount
    //initialize four rangeSliders
    //2: questionsPerPage > questionCount
    //initialize only as much rangeSliders as questionCount
    //set others to display:none
    //3: questionsPerPage < questionCount
    //initialize four rangeSliders
    //after on click on sendRatings
    //initialize the already exisiting sliders with the remaining ones

    if(questionCount === questionsPerPage || questionCount > questionsPerPage) {
        for (var i = 0; i < questionsPerPage; i++) {
            rangeSliderArray[i]= app.range.create({
                el: '#slider' + i,
                min: 0,
                max: 20,
                step:1,
                on: {
                    change: function () {
                    }
                }
            });
        }
    }
    else if(questionCount < questionsPerPage){
        for (var i = 0; i < questionsPerPage;i++) {
            if (i < questionCount) {
                rangeSliderArray[i] = app.range.create({
                    el: '#slider' + i,
                    min: 0,
                    max: 20,
                    step:1,
                    on: {
                        change: function () {
                            //console.log('Range Slider value changed')
                        }
                    }
                });
            }
            else{
                $('#slider'+i).toggle();
            }
        }
    }
    return rangeSliderArray;
};
