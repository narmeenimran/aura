// Aura Service Worker
// Basic setup for PWA install + offline support (can be expanded later)

self.addEventListener("install", (event) => {
  // Activate immediately after installation
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // Take control of all pages immediately
  event.waitUntil(clients.claim());
});

// For now, all fetch requests just pass through.
// You can add caching later if you want offline mode.
self.addEventListener("fetch", (event) => {
  return;
});
