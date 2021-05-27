const CACHE_NAME = 'static-cache-v2';
const DATA_CACHE_NAME = 'data-cache-v1';

// TODO: add listener and handler to cache static assets
const FILES_TO_CACHE = [
  '/',
  '/manifest.webmanifest',
  '/index.html',
  '/index.js',
  '/style.css',
  '/assets/icons/icon-192x192.jpg',
  '/assets/icons/icon-512x512.jpg',
];

// TODO: add listener and handler to retrieve static assets from the Cache Storage in the browser
// self.addEventListener('install', (event) => {
//   event.waitUntil(
//     caches.open('static').then((cache) => {
//       return cache.addAll(filesToCache);
//     })
//   );
//   self.skipWaiting();
// });
// self.addEventListener('fetch', (event) => {
//   event.respondWith(
//     caches.match(event.request).then((response) => {
//       return response || fetch(event.reqest);
//     })
//   );
// });

// install event handler
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('static').then((cache) => {
      return cache.addAll([
        './',
        './index.html',
        './assets/css/style.css',
        './assets/images/brandenburg.jpg',
        './assets/images/reichstag.jpg',
        './assets/images/map.jpg',
      ]);
    })
  );
  console.log('Install');
  self.skipWaiting();
});
// retrieve assets from cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
