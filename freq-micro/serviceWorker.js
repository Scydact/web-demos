// Taken from https://serviceworke.rs/strategy-network-or-cache_service-worker_doc.html
var CACHE = 'freq-type-127981287231';

self.addEventListener('install', function (evt) {
    console.log('Service worker installed...');
    evt.waitUntil(precache());
});

self.addEventListener('fetch', function (evt) {
    evt.respondWith(networkFirst(evt.request));
});

function precache() {
    return caches.open(CACHE).then(function (cache) {
        return cache.addAll([
            './',
            './index.html',
        ])
    })
}

async function networkFirst(req) {
    const cache = await caches.open(CACHE);
    try {
        const fresh = await fetch(req);
        cache.put(req, fresh.clone());
        return fresh;
    } catch (e) {
        const cachedResponse = await cache.match(req);
        return cachedResponse;
    }
}