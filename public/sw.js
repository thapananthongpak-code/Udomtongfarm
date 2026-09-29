// Udomtong Farm service worker
// - Pages: network first, falling back to the cached app shell when offline.
// - Hashed build assets: cache first (their URLs change on every build).
// - Images and other static files: stale-while-revalidate.

const VERSION = "v2";
const SHELL_CACHE = `udomtong-shell-${VERSION}`;
const ASSET_CACHE = `udomtong-assets-${VERSION}`;
const IMAGE_CACHE = `udomtong-images-${VERSION}`;
const KEEP = [SHELL_CACHE, ASSET_CACHE, IMAGE_CACHE];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(["/", "/manifest.webmanifest", "/favicon.svg"]))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      // The previous version cached every page forever, so visitors never saw new builds.
      const hadLegacyCache = keys.includes("udomtong-v1");
      await Promise.all(keys.filter((key) => !KEEP.includes(key)).map((key) => caches.delete(key)));
      await self.clients.claim();
      if (hadLegacyCache) {
        const windows = await self.clients.matchAll({ type: "window" });
        windows.forEach((client) => client.navigate(client.url));
      }
    })(),
  );
});

async function networkFirstPage(request) {
  const cache = await caches.open(SHELL_CACHE);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put("/", response.clone());
    return response;
  } catch {
    return (await cache.match("/")) || Response.error();
  }
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) cache.put(request, response.clone());
  return response;
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => cached || Response.error());
  return cached || network;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirstPage(request));
    return;
  }
  if (url.pathname.startsWith("/assets/")) {
    event.respondWith(cacheFirst(request, ASSET_CACHE));
    return;
  }
  if (url.pathname.startsWith("/images/") || url.pathname.startsWith("/icons/")) {
    event.respondWith(staleWhileRevalidate(request, IMAGE_CACHE));
  }
});
