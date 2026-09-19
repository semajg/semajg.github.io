// Minimal service worker -- exists mainly to satisfy the "installable web
// app" criteria (a registered service worker with a fetch handler is one
// of the checks browsers use before offering an install prompt / letting
// someone "Add to Home Screen"). It does NOT cache or intercept anything --
// every request just passes straight through to the network. That's
// deliberate: this is a Vite build, so asset filenames change on every
// deploy (content-hashed), and caching them here risks serving a stale
// app shell after you push an update. Song playback isn't cached here
// either -- it always streams live from wherever each song's URL points.

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});
