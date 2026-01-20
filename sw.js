self.addEventListener("install", event => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  self.clients.claim();
});

self.addEventListener("message", async event => {
  if (event.data.action === "cache-audio") {
    const cache = await caches.open("audio-cache");
    await cache.add(event.data.url);
  }
});

self.addEventListener("fetch", event => {
  if (event.request.destination === "audio") {
    event.respondWith(
      caches.match(event.request).then(resp => resp || fetch(event.request))
    );
  }
});
