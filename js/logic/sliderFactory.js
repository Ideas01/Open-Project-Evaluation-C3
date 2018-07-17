


function SliderFactory() {}



SliderFactory.prototype.createRangeSliders = function (questionCount,headers) {

    var sliderIDs = [];

    //calculate size relative to the number of questions
    var percentage = 100/questionCount;

    for (var i = 0; i < questionCount; i++) {

        //create div that will hold the header for the slider, the slider and the value display for the slider
        //create the slider
        var newSliderDiv = document.createElement("div");
        newSliderDiv.id = "sliderDiv" + i;
        newSliderDiv.className = "sliderDiv";
        newSliderDiv.style.width = percentage + "%";
        newSliderDiv.style.height = 100 + "%";

        var newSlider = document.createElement('input');
        newSlider.id = 'slider' + i;
        newSlider.className = "slider";
        newSlider.type = 'range';
        newSlider.min = "0";
        newSlider.max = "10";
        newSlider.value = "0";
        newSlider.step = "1";

        //create the header
        var newHeader = document.createElement("p");
        newHeader.id = "header" + i;
        newHeader.className = "header";
        newHeader.innerText = headers[i];
        newHeader.style.width = percentage + "%";

        //append everything
        $('.page-content').append(newSliderDiv);
        var selection = $('#sliderDiv'+i);
        selection.append(newHeader);
        selection.append(newSlider);

        sliderIDs.push(newSlider.id);
    }
        return sliderIDs;


};

