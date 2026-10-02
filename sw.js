// Offline support: precache the game shell, then serve from cache and refresh in the background.
 // Bump VERSION whenever the precache list changes.
const VERSION = 'pig-home-v4';
const PRECACHE = [
 './',
 './index.html',
 './story-support.js',
 './manifest.json',
 './assets/finale-palace.svg',
 './icons/icon.svg',
 './icons/icon-192.png',
 './icons/icon-512.png',
 './icons/apple-touch-icon.png'
];

self.addEventListener('install', event => {
 event.waitUntil(caches.open(VERSION).then(cache => cache.addAll(PRECACHE.map(url => new Request(url, {cache: 'reload'})))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
 event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== VERSION).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
 const request = event.request;
 if (request.method !== 'GET' || request.headers.has('range')) return;
 const url = new URL(request.url);
 if (url.origin !== self.location.origin) return;
 event.respondWith(caches.open(VERSION).then(async cache => {
  const key = request.mode === 'navigate' ? './index.html' : request;
  const cached = await cache.match(key, {ignoreSearch: request.mode === 'navigate'});
  const network = fetch(request).then(response => {
   if (response.ok && response.status === 200) cache.put(key, response.clone());
   return response;
  }).catch(() => cached || Response.error());
  if (cached) { event.waitUntil(network.catch(() => {})); return cached; }
  return network;
 }));
});
