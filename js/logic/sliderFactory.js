
var app = new Framework7();

function SliderFactory() {}

//the amount of displayed range sliders per page
var questionsPerPage = 4;

/**
 *
 * Determines the amount of range-sliders to be initialized
 *
 * @param startIndex is used to determine where we access the data in rangeSliderObject
 * @param questionCount is used to determine the amount of sliders to display
 * @param rangeSliderObjects Array, which contains data for the range sliders
 * @returns {Array}
 */
SliderFactory.prototype.determineRangeSliderAmount = function (startIndex, questionCount, rangeSliderObjects) {
<<<<<<< HEAD
    var indexToStart = startIndex;
    //are there at least as much questions as questions per page?
    if(questionCount === questionsPerPage || questionCount > questionsPerPage) {

        //remove drawable components of the initialized sliders, otherwise they will be displayed twice!
        removeRangeBar();

        //array to save the slider references
        var rangeSliderArray=[];

        for (var i = 0; i < questionsPerPage; i++) {
            //append the question text and the labels for the sliders
            $('#sliderText'+i).text(rangeSliderObjects[indexToStart].value);
            $('#satisfied'+i).text(rangeSliderObjects[indexToStart].labels[0].label);
            $('#unsatisfied'+i).text(rangeSliderObjects[indexToStart].labels[1].label);

            //initialize the sliders
            initializeRangeSlider(rangeSliderArray,i,rangeSliderObjects,indexToStart);
            //id for mapping the data to a question
=======

    var indexToStart = startIndex;

    //are there at least as much questions as questions per page?
    if(questionCount === questionsPerPage || questionCount > questionsPerPage) {

        //remove drawable components of the initialized sliders, otherwise they will be displayed twice!
        removeRangeBar();

        //array to save the slider references
        var rangeSliderArray=[];

        for (var i = 0; i < questionsPerPage; i++) {
            //append the question text and the labels for the sliders
            $('#sliderText'+i).text(rangeSliderObjects[indexToStart].value);
            $('#satisfied'+i).text(rangeSliderObjects[indexToStart].label[0]);
            $('#unsatisfied'+i).text(rangeSliderObjects[indexToStart].label[1]);

            //initialize the sliders
            initializeRangeSlider(rangeSliderArray,i,rangeSliderObjects,indexToStart);
>>>>>>> zusammenführen-C
            rangeSliderArray[i].questionId = indexToStart;
            indexToStart++;
        }
    }
    //all remaining questions fit one page
    else if(questionCount < questionsPerPage){
        //array to save the slider references
        var rangeSliderArray=[];

        //remove drawable components of the initialized sliders, otherwise they will be displayed twice!
        removeRangeBar();

        for (var i = 0; i < questionsPerPage;i++) {
            //determine how much slider need to be initialized
            if (i < questionCount) {
                //append the question text and the labels for the sliders
                $('#sliderText'+i).text(rangeSliderObjects[indexToStart].value);
<<<<<<< HEAD
                $('#unsatisfied'+i).text(rangeSliderObjects[indexToStart].labels[1].label);
                $('#satisfied'+i).text(rangeSliderObjects[indexToStart].labels[0].label);
=======
                $('#unsatisfied'+i).text(rangeSliderObjects[indexToStart].label[1]);
                $('#satisfied'+i).text(rangeSliderObjects[indexToStart].label[0]);

>>>>>>> zusammenführen-C
                //initialize the sliders
                initializeRangeSlider(rangeSliderArray,i,rangeSliderObjects,indexToStart);
                rangeSliderArray[i].questionId = indexToStart;
            }
            //all questions are displayed at a slider, so hide the rest
            else{
                $('#unsatisfied'+i).toggle();
                $('#satisfied'+i).toggle();
                $('#sliderText'+i).toggle();
                $('#slider'+i).toggle();

            }
            indexToStart++;
        }
    }
    return rangeSliderArray;
};

/**
 *
 * Initializes range-slider Objects. References to the range-slider Objects get
 * stored in an array.
 *
 * @param rangeSliderArray the array to store the rangeSliderReferences
 * @param index the index to put the references in the rangeSliderReference Array
 * @param rangeSliderObject data for initializing the range-sliders
 * @param indexToStart index for entering the data for the range-sliders
 */
function initializeRangeSlider(rangeSliderArray,index,rangeSliderObject,indexToStart){
<<<<<<< HEAD

=======
>>>>>>> zusammenführen-C
    rangeSliderArray[index]= app.range.create({
        el: '#slider' + index,
        min: 0,
        max: (rangeSliderObject[indexToStart].max - rangeSliderObject[indexToStart].min),
<<<<<<< HEAD
        step: checkStepSize(rangeSliderObject[indexToStart].max,rangeSliderObject[indexToStart].stepSize),
=======
        step :checkStepSize(rangeSliderObject[indexToStart].max,rangeSliderObject[indexToStart].stepSize),
>>>>>>> zusammenführen-C
        on: {
            change: function () {
            }
        }
    });
    app.range.setValue('#slider'+index,0);
}

/**
 * removes the range-bar component of already initialized range-sliders
 */
function removeRangeBar() {
    $('.range-bar').remove();
    $('.range-knob-wrap').remove();
}

/**
 *
 * checks if the stepSize used to initialize the sliders is valid
 *
 * @param maxValue maxValue of the slider
 * @param stepSize stepSize of the slider
 * @returns {*} return an RangeError if stepSize is invalid, otherwise returns stepSize
 */
function checkStepSize(maxValue, stepSize) {

    if(stepSize > maxValue){
        throw new RangeError('stepSize of is greater than the maximum value of the slider');
    }
    else if(stepSize <= 0){
        throw new RangeError('stepSize can not be zero');
    }
    //steps would not be even sized
    else if((maxValue % stepSize) > 0){
        throw new RangeError('stepSize is not an even number');
    }
    else{
        return stepSize;
    }
}