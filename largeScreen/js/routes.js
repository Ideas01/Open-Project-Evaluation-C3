routes = [
    {
		path: '/',
		url: './index.html',
	},
    {
        path: '/auswahl/',
        url: './pages/prototypeAuswahl.html',
    },
    {
        path: '/puzzle/',
        url: './pages/puzzle.html',
    },
    {
        path: '/highscore/',
        url: './pages/highscore.html'
    },
    // Default route (404 page). MUST BE THE LAST
    {
        path: '(.*)',
        url: './pages/404.html',
    },
];
