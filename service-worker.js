// var dataCacheName = 'pwa-data13' + Math.random();
// var cacheName = 'pwa-data13' + Math.random();

var dataCacheName = 'pwa-data131';
var cacheName = 'pwa-data131';

var filesToCache = [
  '/',
  '/index.html',
  '/scripts/app.js',
  '/scripts/material.js',
  '/styles/inline.css',
  '/styles/material.css',
  '/images/logo.png',
  '/images/icons/icon_128x128.png',
  '/images/icons/icon_144x144.png',
  '/images/icons/icon_152x152.png',
  '/images/icons/icon_192x192.png',
  '/images/icons/icon_256x256.png',
  '/styles/font.woff2'
];


/*
 * Add specific files to cache
 */
self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName && key !== dataCacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  /*
   * Fixes a corner case in which the app wasn't returning the latest data.
   * You can reproduce the corner case by commenting out the line below and
   * then doing the following steps: 1) load app for first time so that the
   * initial New York City data is shown 2) press the refresh button on the
   * app 3) go offline 4) reload the app. You expect to see the newer NYC
   * data, but you actually see the initial data. This happens because the
   * service worker is not yet activated. The code below essentially lets
   * you activate the service worker faster.
   */
  return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  // console.log('[Service Worker] Fetch', e.request.url);
  var dataUrl = 'https://swapi.co/api';
  // verifica se a url é a da api
  if (e.request.url.indexOf(dataUrl) > -1) {
    e.respondWith(
      // abro o cache local
      caches.open(dataCacheName).then(function(cache) {
        // bato na api efetivamente
        return fetch(e.request).then(function(response){
          // coloco a resposta no cache
          cache.put(e.request.url, response.clone());
          return response;
        });
      })
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
      })
    );
  }
});
