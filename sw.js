const CACHE_NAME = 'horizontizer-cache-v3';

// All files the app needs to run offline (relative paths so the app
// also works when served from a subdirectory).
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './mySketch.js',
  './beach.jpg',
  './manifest.json',
  './apple-touch-icon.png',
  'https://cdn.jsdelivr.net/npm/p5@1.11.3/lib/p5.js' // p5js lib (opaque)
];

// 1. Install Event: Cache all critical files.
// cache.addAll() rejects if ANY request fails (e.g. the cross-origin
// CDN response), which would break offline support entirely. Cache
// each asset individually and tolerate individual failures instead.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching app assets...');
      const requests = ASSETS_TO_CACHE.map((url) =>
        cache.add(new Request(url, { mode: 'no-cors' })).catch((err) => {
          console.warn('Failed to cache:', url, err);
        })
      );
      return Promise.all(requests);
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
