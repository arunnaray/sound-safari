/**
 * Sound Safari — Service Worker
 * Caches all assets for full offline use.
 * Strategy: Cache-first for static assets, Network-first for HTML.
 */

const CACHE_NAME    = 'soundsafari-v1';
const CACHE_STATIC  = 'soundsafari-static-v1';

// All files to pre-cache on install
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/speech-therapy-game.html',
  '/soundsafari-admin.html',
  '/manifest.json',
  '/favicon.ico',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png',
  // Google Fonts (cached on first load if online)
  'https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@700;900&display=swap',
  'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Fredoka+One&display=swap',
];

// ── Install: pre-cache all static assets ─────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_STATIC)
      .then(cache => {
        // Cache local files (must succeed)
        const localFiles = PRECACHE_URLS.filter(u => !u.startsWith('http'));
        return cache.addAll(localFiles)
          .then(() => {
            // Cache external fonts (best effort — don't fail install if offline)
            const externalFiles = PRECACHE_URLS.filter(u => u.startsWith('http'));
            return Promise.allSettled(
              externalFiles.map(url =>
                fetch(url).then(r => cache.put(url, r)).catch(() => {})
              )
            );
          });
      })
      .then(() => self.skipWaiting())
  );
});

// ── Activate: clean up old caches ────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_STATIC && k !== CACHE_NAME)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: serve from cache, fall back to network ────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and chrome-extension requests
  if (request.method !== 'GET') return;
  if (url.protocol === 'chrome-extension:') return;

  // For HTML pages: Network-first (get latest), fall back to cache
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Update cache with fresh response
          const clone = response.clone();
          caches.open(CACHE_STATIC).then(c => c.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // For everything else: Cache-first
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        // Cache successful responses
        if (response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_STATIC).then(c => c.put(request, clone));
        }
        return response;
      }).catch(() => {
        // Return offline fallback for images
        if (request.destination === 'image') {
          return new Response(
            '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><text y="50" font-size="40">📵</text></svg>',
            { headers: { 'Content-Type': 'image/svg+xml' } }
          );
        }
      });
    })
  );
});

// ── Message: force cache refresh ─────────────────────
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
  if (event.data?.type === 'CLEAR_CACHE') {
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))));
  }
});
