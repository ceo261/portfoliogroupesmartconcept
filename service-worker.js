const CACHE_NAME = "groupe-smart-portfolio-v1";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./index-en.html",
  "./index-es.html",
  "./index-ar.html",
  "./manifest.webmanifest",
  "./pwa.css",
  "./pwa.js",
  "./pwa-icon-192.png",
  "./pwa-icon-512.png",
  "./pwa-icon-maskable-512.png",
  "./apple-touch-icon.png",
  "./asset-assets-logo-groupe-or-transparent.png",
  "./asset-assets-social-preview-v2.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match("./")))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const fresh = fetch(request)
        .then((response) => {
          if (response.ok) caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone()));
          return response;
        })
        .catch(() => cached);
      return cached || fresh;
    })
  );
});
