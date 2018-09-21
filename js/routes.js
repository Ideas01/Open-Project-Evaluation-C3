routes = [
    {
        path: '/',
        url: './index.html',
    },
	{
		path: '/prototypeSelection/',
		url: './pages/prototypeSelection.html',
	},
    {
        path: '/auswahl/',
        url: './pages/prototypeAuswahl.html',
    },
    {
        path: '/prototype/',
        url: './pages/prototype2.html',
    },
    {
        path: '/sliders/',
        url: './pages/sliders.html',
    },
    {
        path: '/puzzle/',
        url: './pages/puzzle.html',
    },
    {
        path: '/puzzleGuess/',
        url: './pages/puzzleGuess.html',
    },
    {
        path: '/settings/',
        url: './pages/settings.html'
    },
    {
        path: '/success/',
        url: './pages/success.html'
    },
    {
        path: '/failure/',
        url: './pages/failure.html'
    },
    // Default route (404 page). MUST BE THE LAST
    {
        path: '(.*)',
        url: './pages/404.html',
    },
];
