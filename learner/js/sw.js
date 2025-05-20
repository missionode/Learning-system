const CACHE_NAME = 'learning-system-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/dashboard.html',
  '/congratulations.html',
  '/help.html',
  '/journey.html',
  '/onboarding.html',
  '/profile-builder.html',
  '/profile.html',
  '/quiz.html',
  '/settings.html',
  '/topic-detail.html',
  '/track-progress.html',
  '/offline.html',
  '/css/style.css',
  '/css/dashboard.css',
  '/css/congrats.css',
  '/css/help.css',
  '/css/journey.css',
  '/css/onboarding.css',
  '/css/profile-builder.css',
  '/css/profile.css',
  '/css/quiz.css',
  '/css/settings.css',
  '/css/splash.css',
  '/css/topic-detail.css',
  '/css/track-progress.css',
  '/js/script.js',
  '/js/dashboard.js',
  '/js/help.js',
  '/js/journey.js',
  '/js/onboarding.js',
  '/js/profile-builder.js',
  '/js/profile.js',
  '/js/quiz.js',
  '/js/settings.js',
  '/js/splash.js',
  '/js/topic-detail.js',
  '/js/track-progress.js',
  '/lib/chart.js',
  '/assets/images/hiking.gif',
  '/assets/images/onboarding1.jpg',
  '/assets/images/onboarding2.jpg',
  '/assets/images/onboarding3.jpg',
  '/assets/images/onboarding4.jpg',
  '/assets/images/onboarding5.jpg',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
  '/apple-touch-icon.png',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/favicon.ico',
  '/sample.json',
  '/site.webmanifest'
];

// Install event: Cache all static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting(); // Activate immediately
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim(); // Take control immediately
});

// Fetch event: Cache-first for static assets, network-first for dynamic data
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Handle navigation requests (HTML pages)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => response)
        .catch(() => caches.match('/offline.html'))
    );
    return;
  }

  // Handle static assets (cache-first)
  if (STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
    return;
  }

  // Handle dynamic data (network-first, e.g., sample.json)
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
      .catch(() => {
        // Return cached response if available
        return caches.match(event.request);
      })
  );
});