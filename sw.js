// Minimal service worker -- exists mainly to satisfy the "installable web
// app" criteria (a registered service worker with a fetch handler is one
// of the checks browsers use before offering an install prompt / letting
// someone "Add to Home Screen"). It does NOT cache anything -- same-origin
// requests just pass straight through to the network, and cross-origin
// ones (song URLs) are left entirely alone, see the fetch handler below. That's
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
  // Only handle this site's own files. Anything cross-origin -- above all the
  // song/media URLs, which usually point at a server on the LAN -- must go
  // straight from the page to the network, NOT through this worker.
  // Re-fetching them from here makes the request originate from the service
  // worker, which has no page to show Chrome's "Local Network Access"
  // permission prompt on, so Chrome denies it outright ("Permission was
  // denied for this request to access the `local` address space") and the
  // video "can't be played". Not calling respondWith() lets the browser
  // handle the request itself, exactly as if no service worker existed.
  if (new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(fetch(event.request));
});
