function SwiperFactory() {}

SwiperFactory.prototype.initializeSwiper = function () {
    new Swiper('.swiper-container', {
        spaceBetween: 100
    });
};

SwiperFactory.prototype.fillSwiper =function (imageArray) {
    var mySwiper = document.querySelector('.swiper-container').swiper;

    for(var n=0; n < imageArray.imageUrls.length; n++){
        mySwiper.appendSlide('<div class="testslider swiper-slide" id="swiper' + n + '"></div>');
        $("#swiper" +n).css('background-image','url("' + getImageUrl(imageArray.imageUrls,n) +'")');
        $("#swiper"+n).css('background-size',"contain");
        $("#swiper"+n).css('background-repeat',"no-repeat");
    }
    return mySwiper;
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
