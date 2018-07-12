

$('document').ready(function () {


    //get how many questions their are for this survey
    var questionCount = 2;


    var sliderFactory = new SliderFactory();

    //create number of sliders according to questionCount
    var rangeSliders = sliderFactory.createRangeSliders(questionCount);



});
