function ChoiceFactory() {}

ChoiceFactory.prototype.buildPrototypeChoice = function (id,appendToSwiperId) {
    let choiceWrapperId = buildChoiceWrapper(id,'prototypeChoiceWrapper',appendToSwiperId);

};

function buildChoiceWrapper(id, divClass, appendToSwiper) {
    let choiceWrapper = document.createElement('div');
    choiceWrapper.id = 'choiceWrapper' +id;
    choiceWrapper.className = divClass;
    $('#'+ appendToSwiper).append(choiceWrapper);
    return choiceWrapper.id;
}


function buildTitle(id, divClass, appendToWrapperId){
    let title = document.createElement('h2');
    title.id = 'title'+id;
    title.className = divClass;
    $('#'+ appendToWrapperId).append(title);
}


function setChoiceHandlers() {
    $('.prototypeChoiceWrapper').click(function (event) {
        $('.prototypeChoiceWrapper:not(#' + event.target.id + ')').css('border-color','white');
        $('#'+ event.target.id).css('border-color','blue');
    });
}




/*function setImages(prototypeImageObjects) {
    //how many wrappers need to be set?
    let wrapperCount = $('.prototypeChoiceWrapper').length;
    for(var i=0; i <= wrapperCount; i++){
        let images = $('#choiceWrapper' +i).find('img');
        $(images).each(function (index,value) {
           document.getElementById(value.id).src = prototypeImageObjects[0].url;
        });
    }

    //for all prototypeWrappers
        //select the first one
            //find out how many images there are
            //fill them with the correct prototypeImages
        //go to the next one
}*/


