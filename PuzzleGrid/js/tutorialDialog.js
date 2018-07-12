var app = new Framework7({
    // App root element
    root: '#app',
    // App Name
    name: 'My App',
    // App id
    id: 'com.myapp.test',
    // Enable swipe panel
    panel: {
        swipe: 'left',
    },
    // Add default routes
    routes: [
        {
            path: '/about/',
            url: 'about.html',
        },
    ],
    // ... other parameters
});

var $$ = Dom7;

// DOM events for About popup
$$('.popup-about').on('popup:open', function (e, popup) {
    console.log('About popup open');
});
$$('.popup-about').on('popup:opened', function (e, popup) {
    console.log('About popup opened');
});


function alert() {


// Create dynamic Popup
    var dynamicPopup = app.popup.create({
        content: '<div class="popup">' +
        '<div class="block">' +
        '<p>Popup created dynamically.</p>' +
        '<p><a href="#" class="link popup-close">Close me</a></p>' +
        '</div>' +
        '</div>',
        // Events
        on: {
            open: function (popup) {
                console.log('Popup open');
            },
            opened: function (popup) {
                console.log('Popup opened');
            },
        }
    });
// Events also can be assigned on instance later
    dynamicPopup.on('close', function (popup) {
        console.log('Popup close');
    });
    dynamicPopup.on('closed', function (popup) {
        console.log('Popup closed');
    });

// Open dynamic popup
    $$('.dynamic-popup').on('click', function () {
        dynamicPopup.open();
    });
}