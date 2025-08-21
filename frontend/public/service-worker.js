// Service Worker for Launcher App
// Handles caching, update detection, and forced refreshes

const CACHE_NAME = 'launcher-app-v1';
const RUNTIME_CACHE = 'launcher-runtime';

// Files to cache on install
const STATIC_CACHE_URLS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching static assets...');
        return cache.addAll(STATIC_CACHE_URLS.map(url => new Request(url, {
          credentials: 'same-origin'
        })));
      })
      .then(() => {
        console.log('Static assets cached successfully');
        // Force activation
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker activated');
      // Take control of all clients
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip external requests
  if (url.origin !== self.location.origin) {
    return;
  }
  
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Fallback to network
        return fetch(request)
          .then((networkResponse) => {
            // Don't cache opaque responses
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            
            // Cache the response
            const responseToCache = networkResponse.clone();
            caches.open(RUNTIME_CACHE)
              .then((cache) => {
                cache.put(request, responseToCache);
              });
            
            return networkResponse;
          })
          .catch((error) => {
            console.error('Fetch failed:', error);
            
            // Return offline fallback for navigation requests
            if (request.mode === 'navigate') {
              return caches.match('/');
            }
            
            throw error;
          });
      })
  );
});

// Message handler for update control
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      console.log('Force updating service worker...');
      self.skipWaiting();
      break;
      
    case 'CHECK_UPDATE':
      console.log('Checking for updates...');
      checkForUpdates().then((hasUpdate) => {
        event.ports[0].postMessage({
          type: 'UPDATE_CHECK_RESULT',
          payload: { hasUpdate }
        });
      });
      break;
      
    case 'FORCE_UPDATE':
      console.log('Force updating app...');
      forceUpdate().then(() => {
        event.ports[0].postMessage({
          type: 'UPDATE_COMPLETED'
        });
      });
      break;
      
    case 'CLEAR_CACHE':
      console.log('Clearing all caches...');
      clearAllCaches().then(() => {
        event.ports[0].postMessage({
          type: 'CACHE_CLEARED'
        });
      });
      break;
      
    default:
      console.log('Unknown message type:', type);
  }
});

// Check for updates by comparing build time
async function checkForUpdates() {
  try {
    const response = await fetch('/manifest.json', { 
      cache: 'no-cache',
      credentials: 'same-origin'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch manifest');
    }
    
    const manifest = await response.json();
    const currentBuildTime = manifest.build_time;
    
    // Get stored build time
    const stored = await caches.open(CACHE_NAME);
    const cachedManifest = await stored.match('/manifest.json');
    
    if (cachedManifest) {
      const cachedData = await cachedManifest.json();
      const cachedBuildTime = cachedData.build_time;
      
      // Compare build times
      return currentBuildTime !== cachedBuildTime;
    }
    
    return true; // No cached version, assume update available
  } catch (error) {
    console.error('Update check failed:', error);
    return false;
  }
}

// Force update by clearing caches and reloading
async function forceUpdate() {
  try {
    // Clear all caches
    await clearAllCaches();
    
    // Notify all clients to reload
    const clients = await self.clients.matchAll();
    clients.forEach((client) => {
      client.postMessage({
        type: 'FORCE_RELOAD'
      });
    });
    
    console.log('Force update completed');
  } catch (error) {
    console.error('Force update failed:', error);
  }
}

// Clear all caches
async function clearAllCaches() {
  try {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map((cacheName) => caches.delete(cacheName))
    );
    console.log('All caches cleared');
  } catch (error) {
    console.error('Failed to clear caches:', error);
  }
}

// Background sync for updates (when supported)
if ('sync' in self.registration) {
  self.addEventListener('sync', (event) => {
    if (event.tag === 'background-update-check') {
      event.waitUntil(
        checkForUpdates().then((hasUpdate) => {
          if (hasUpdate) {
            // Notify clients about available update
            self.clients.matchAll().then((clients) => {
              clients.forEach((client) => {
                client.postMessage({
                  type: 'UPDATE_AVAILABLE'
                });
              });
            });
          }
        })
      );
    }
  });
}

console.log('Service Worker loaded successfully');