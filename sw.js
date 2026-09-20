const CACHE_NAME = 'horizontizer-cache-v1';

// Add all the files your app needs to run offline (no icon and manifest)
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',        // CSS file
  '/mySketch.js',      // JS file
  '/beach.jpg',        // other files
  'https://cdn.jsdelivr.net/npm/p5@1.11.3/lib/p5.js' //p5js lib
];

// 1. Install Event: Cache all critical files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching app assets...');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting()) // Force the waiting service worker to become active
  );
});

// 2. Activate Event: Clean up old caches if you update the version
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Clearing old cache...');
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim()) // Take control of open pages immediately
  );
});

// 3. Fetch Event: Intercept requests and serve from cache if offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return the cached file if found, otherwise try the network
      return cachedResponse || fetch(event.request).catch(() => {
        // Fallback or error handling if both fail (offline and not cached)
        console.log('Network failed and asset not in cache:', event.request.url);
      });
    })
  );
});
