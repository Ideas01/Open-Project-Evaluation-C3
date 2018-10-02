/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * sliderFactory.js 
 * 
 * factory to create sliders for evaluating prototypes
 * 
 * required files:
 * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

class SliderFactory
{
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * C O N S T R U C T O R   &   A T T R I B U T E S
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
	constructor()
	{
		this.questionsPerPage = 4; //the amount of displayed range sliders per page
	} 
	
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * P U B L I C - F U N C T I O N S
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
	/**
	 *
	 * Determines the amount of range-sliders to be initialized
	 *
	 * @param startIndex is used to determine where we access the data in rangeSliderObject
	 * @param questionCount is used to determine the amount of sliders to display
	 * @param rangeSliderObjects Array, which contains data for the range sliders
	 * @returns {Array}
	 */
	determineRangeSliderAmount(startIndex, questionCount, rangeSliderObjects) {
		var indexToStart = startIndex;
		//are there at least as much questions as questions per page?
		if(questionCount === this.questionsPerPage || questionCount > this.questionsPerPage) {

			//remove drawable components of the initialized sliders, otherwise they will be displayed twice!
			removeRangeBar();

			//array to save the slider references
			var rangeSliderArray=[];

			for (var i = 0; i < this.questionsPerPage; i++) {
				//append the question text and the labels for the sliders
				$('#sliderText'+i).text(rangeSliderObjects[indexToStart].value);
				$('#unsatisfied'+i).text(rangeSliderObjects[indexToStart].labels[0].label);
				$('#satisfied'+i).text(rangeSliderObjects[indexToStart].labels[1].label);

				//initialize the sliders
				initializeRangeSlider(rangeSliderArray,i,rangeSliderObjects,indexToStart);
				//id for mapping the data to a question
				rangeSliderArray[i].questionId = indexToStart;
				indexToStart++;
			}
		}
		//all remaining questions fit one page
		else if(questionCount < this.questionsPerPage){
			//array to save the slider references
			var rangeSliderArray=[];

			//remove drawable components of the initialized sliders, otherwise they will be displayed twice!
			removeRangeBar();

			for (var i = 0; i < this.questionsPerPage;i++) {
				//determine how much slider need to be initialized
				if (i < questionCount) {
					//append the question text and the labels for the sliders
					$('#sliderText'+i).text(rangeSliderObjects[indexToStart].value);
					$('#satisfied'+i).text(rangeSliderObjects[indexToStart].labels[1].label);
					$('#unsatisfied'+i).text(rangeSliderObjects[indexToStart].labels[0].label);
					//initialize the sliders
					initializeRangeSlider(rangeSliderArray,i,rangeSliderObjects,indexToStart);
					rangeSliderArray[i].questionId = indexToStart;
				}
				//all questions are displayed at a slider, so hide the rest
				else{
					$('#satisfied'+i).toggle();
					$('#unsatisfied'+i).toggle();
					$('#sliderText'+i).toggle();
					$('#slider'+i).toggle();

				}
				indexToStart++;
			}
		}
		return rangeSliderArray;
	};
}
 /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * END CLASS DEFINITION
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */	
 
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * I N T E R N A L - F U N C T I O N S
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */	
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
	//var app = new Framework7();
    rangeSliderArray[index]= app.range.create({
        el: '#slider' + index,
        min: 0,
        max: (rangeSliderObject[indexToStart].max - rangeSliderObject[indexToStart].min),
        step: checkStepSize(rangeSliderObject[indexToStart].max,rangeSliderObject[indexToStart].stepSize),
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
