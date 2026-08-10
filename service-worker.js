const DENTAPP_CACHE = "dentapp-shell-v14";
const SHELL_FILES = [
  "/",
  "/index.html",
  "/styles.css",
  "/app.js",
  "/data.js",
  "/supabase-config.js",
  "/manifest.json",
  "/favicon.ico",
  "/assets/favicon-16.png",
  "/assets/favicon-32.png",
  "/assets/favicon-48.png",
  "/assets/apple-touch-icon.png",
  "/assets/icon-192.png",
  "/assets/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(DENTAPP_CACHE).then((cache) => cache.addAll(SHELL_FILES))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== DENTAPP_CACHE).map((key) => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(DENTAPP_CACHE).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match("/index.html")))
  );
});
