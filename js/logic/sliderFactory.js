
var app = new Framework7();

function SliderFactory() {}



SliderFactory.prototype.createRangeSliders = function (questionCount,headers) {

  //count the number of range-sliders in sliders.html, so you know how many you have to initialize
    var sliderCount = $('.page-content .range-slider').length;
    console.log('childElement count: ' +sliderCount);

    //array for storing the range-slider references
    var rangeSliderReferences = [];

    //for every range-slider...
    for(var i=0;i< questionCount; i++) {
        //store the range-slider references in the array...
        rangeSliderReferences[i] = app.range.create({
            //...and initialize i-th range-slider
            el: '#slider'+i,
            on: {
                change: function () {
                    //console.log(this.value);
                }
            }
        });

    }
    $('.slider-page-content').append('<a href="" id="bewertungBtn" class="button">Bewertung abschicken</a>');

    return rangeSliderReferences;


  /*  var sliderHTML = '<div class="range-slider"><input type="range" min="0" max="100" step="1" value="10"></div>';

    var deferedObject = $.Deferred();

    deferedObject.done(function () {
        console.log("guck ma ich");
        $('.page-content').append(sliderHTML);
    }).done(function () {
        console.log("i bims hier");
        $('.range-slider').append("<p>Hier beginnt ein Absatz, und hier ist er zu Ende.</p>");

        /*var range = app.range.create({
            el: '.range-slider',
            on: {
                change: function () {
                    console.log('Range Slider value changed')
                }
            }
        });
    });

    deferedObject.resolve(); */



    /*  var isAppended = false;

   var promise = new Promise(function (resolve,reject) {
        try{
        var sliderHTML = '<div class="range-slider"><input type="range" min="0" max="100" step="1" value="10"></div>';
        $('.page-content').append(sliderHTML);
            isAppended = true;}
        catch (e) {
            console.log("something went wrong");
        }

        if(isAppended){
            resolve(1)
        }
        else{
            reject(0);
        }
    });

    promise.then(function (result) {
        if (result ==1){
            var range = app.range.create({
                el: '<div class="range-slider"><input type="range" min="0" max="100" step="1" value="10"></div>',
                on: {
                    change: function () {
                        console.log('Range Slider value changed')
                    }
                }
            });
        }
        else{
            console.log("element not ready");
        }
    }); */



    //TODO:OLD SLIDERFACTORY CODE, REMOVE WHEN FRAMEWORK 7 WORKS
    /*
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
        newSliderDiv.style.height = 70 + "%";

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
        $('.slider-page-content').append(newSliderDiv);
        var selection = $('#sliderDiv'+i);
        selection.append(newHeader);
        selection.append(newSlider);

        sliderIDs.push(newSlider.id);
    }
	$('.slider-page-content').append('<a href="" id="bewertungBtn" class="button">Bewertung abschicken</a>');
        return sliderIDs;

 **/
};

