const CACHE_NAME = 'prometric-hero-v1';
const QUESTION_CACHE = 'questions-cache-v1';
const STATIC_CACHE = 'static-cache-v1';

// Static assets to cache on install
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/offline.html',
    '/manifest.json',
];

// Install event — cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(STATIC_CACHE).then((cache) => {
            console.log('[SW] Caching static assets');
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate event — clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME && name !== QUESTION_CACHE && name !== STATIC_CACHE)
                    .map((name) => {
                        console.log('[SW] Deleting old cache:', name);
                        return caches.delete(name);
                    })
            );
        })
    );
    self.clients.claim();
});

// Fetch event — apply caching strategies
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Skip Chrome extension requests
    if (url.protocol === 'chrome-extension:') return;

    // API calls (user data) — Network First
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(networkFirst(request));
        return;
    }

    // Question data — Cache First (for offline study)
    if (url.pathname.startsWith('/api/questions')) {
        event.respondWith(cacheFirst(request, QUESTION_CACHE));
        return;
    }

    // Static assets — Stale While Revalidate
    event.respondWith(staleWhileRevalidate(request));
});

// --- Caching Strategies ---

async function networkFirst(request) {
    try {
        const response = await fetch(request);
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, response.clone());
        return response;
    } catch (error) {
        const cached = await caches.match(request);
        return cached || caches.match('/offline.html');
    }
}

async function cacheFirst(request, cacheName = CACHE_NAME) {
    const cached = await caches.match(request);
    if (cached) return cached;

    try {
        const response = await fetch(request);
        const cache = await caches.open(cacheName);
        cache.put(request, response.clone());
        return response;
    } catch (error) {
        return caches.match('/offline.html');
    }
}

async function staleWhileRevalidate(request) {
    const cached = await caches.match(request);

    const fetchPromise = fetch(request)
        .then((response) => {
            const cache = caches.open(STATIC_CACHE);
            cache.then((c) => c.put(request, response.clone()));
            return response;
        })
        .catch(() => null);

    return cached || fetchPromise || caches.match('/offline.html');
}
