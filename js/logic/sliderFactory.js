
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
                        //console.log('Range Slider value changed')
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



/*  var appendSlider = new Promise(function (resolve,reject) {
  if(questionCount > 0){
      for (var i=0; i < questionCount; i++) {
          var sliderHTML = '<div class="range-slider ' + 'slider' +i + '"><input type="range" min="0" max="100" step="1" value="10"></div>';
          $('.page-content').append(sliderHTML);
      }
       resolve(i);

  }
  reject(new Error("found no range-slider to initialize"));
}); */


/*  var initializeSlider = function () {
      appendSlider.then(function (fulfilled) {
          console.log("promise value:" + fulfilled);
          var init = setInterval(function(){
              for (var i=0; i < questionCount; i++) {
                  var range = app.range.create({
                      el: '.slider'+i,
                      on: {
                          change: function () {
                              console.log('Range Slider value changed')
                          }
                      }
                  });
              }
              if($(".range-knob").length > 0){
                  console.log("foundya")
                  clearInterval(init);
              }
          }, 500);

      }).catch(function (error) {
          console.log(error.message);
      })
  };*/



//TODO:CODE FOR INITIALIZING PRE EXISTING
/** //count the number of range-sliders in sliders.html, so you know how many you have to initialize
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
 **/

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
