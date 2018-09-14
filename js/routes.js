routes = [
  {
    path: '/',
    url: './index.html',
  },
  {
    path: '/prototype/',
    url: './pages/prototype2.html',
  },
  {
    path: '/puzzle/',
    url: './pages/puzzle.html',
  },
  {
    path: '/sliders/',
    url: './pages/sliders.html',
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
