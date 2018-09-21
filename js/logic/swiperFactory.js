function SwiperFactory() {}


SwiperFactory.prototype.initializeSwiper = function () {
    new Swiper('.swiper-container', {
        spaceBetween: 100
    });
};

SwiperFactory.prototype.buildPrototypeSwiper =function (swiperElement, imageArray) {
    var nameSpace = 'prototypeSwiper';
    for(var n=0; n < imageArray.imageUrls.length; n++){
        swiperElement.appendSlide('<div class="testslider swiper-slide" id="'+ nameSpace + n + '"></div>');
        $("#"+ nameSpace +n).css('background-image','url("' + getImageUrl(imageArray.imageUrls,n) +'")');
        $("#" + nameSpace+n).css('background-size',"contain");
        $("#"+ nameSpace +n).css('background-repeat',"no-repeat");
    }
    return swiperElement;
};


function nameSpaceIsAvailable(nameSpace){
	if(document.querySelector("#" + nameSpace) != null){
		return false;
	}else{
		return true;
	}
}


SwiperFactory.prototype.buildSelectionSwiper = function(swiperElement, contextCount){
    let contextPerPage = 4;
    let swiperCount = calculateSwiperCount(contextCount,contextPerPage);
    var swiperArray = [];
	var nameSpace = "prototypeSelectionSwiper";

    for (var i=1;i <= swiperCount; i++){
        swiperElement.appendSlide('<div class="swiper-slide" id="'+ nameSpace + i + '"></div>');
        $("#"+ nameSpace + i).css('margin', '1%');
        $("#"+ nameSpace + i).css('align-content', 'center');
        $("#"+ nameSpace + i).css('width', '45%');
        $("#"+ nameSpace + i).css(' height', '90%');

        swiperArray.push([nameSpace + i]);
        swiperElement.id = swiperArray;
    }
    swiperElement.contextPerPage = contextPerPage;
    return swiperElement;
};

SwiperFactory.prototype.setHandler = function (mySwiper) {
    mySwiper.on('slidePrevTransitionStart', function () {
        mySwiper.off('slideNextTransitionEnd');
    });

  mySwiper.on('touchEnd', function () {
        if (mySwiper.isEnd) {
            mySwiper.on('slideNextTransitionEnd', function () {
                $(".popup").remove();
                var popup = app.popup.create({
                    content:
                    '<div class="popup" id="popupStart">' +
                    '<div class="view">' +
                    '<div class="page">' +
                    '<div class="navbar">' +
                    '<div class="navbar-inner">' +
                    '<div class="title">Popup</div>' +
                    '<div class="right">' +
                    '<a href="#" class="link popup-close">Close</a>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="page-content">' +
                    '<div class="block">' +
                    '<p>Vielen Dank! Du hast dir alle Seiten des Prototypen angeschaut. </p>' +
                    '<div class="next" text-align="center">' +
                    '<div style="margin: 0 auto;width: 510px;">' +
                    '<a href="#" class="button link popup-close" style="float: left; margin-right: 10px;"> Zurück </a>' +
                    '<a href="/sliders/" class="button"> Weiter </a>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>',
                    on: {
                        opened: function () {
                        }
                    },
                    close: function(){
                        $(".popup").remove();
                    }
                });
                app.popup.open(popup.el, true);
            });
        }
    });
};

function getImageUrl(urlArray, imageIndex)
{
    return urlArray[imageIndex];
}

function calculateSwiperCount(contextCount, contextPerPage) {
    //is there a context to display and can the contexts be displayed on one swiper?
    if (contextCount > 0 && contextCount <= contextPerPage )
    {
        //only one swiper is necessary to display all contexts
        return 1;
    }
    let temp = contextCount % contextPerPage;
    if(temp === 0){
        //all swipers display four contexts
        return contextCount/contextPerPage;
    }
    else if(temp > 0){
        //there is one swiper which does not display four contexts
         return Math.floor(contextCount/contextPerPage +1);
    }
    return 0;
}
