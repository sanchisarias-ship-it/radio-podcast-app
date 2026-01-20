self.addEventListener("install", e => self.skipWaiting());
self.addEventListener("activate", e => self.clients.claim());

self.addEventListener("message", async event => {
  const cache = await caches.open("audio-cache-v3");

  if (event.data.action === "cache-audio") {
    await cache.add(event.data.url);
  }

  if (event.data.action === "delete-audio") {
    await cache.delete(event.data.url);
  }

  if (event.data.action === "clear-cache") {
    const keys = await cache.keys();
    for (const req of keys) {
      await cache.delete(req);
    }
  }
});

self.addEventListener("fetch", event => {
  if (event.request.destination === "audio") {
    event.respondWith(
      caches.match(event.request).then(r => r || fetch(event.request))
    );
  }
});
