// Bridge Service Worker - Standalone SW with embedded Launcher logic
// This bridges to the launcher functionality

const LAUNCHER_CACHE_NAME = 'launcher-app-v1';
const LAUNCHER_RUNTIME_CACHE = 'launcher-runtime';

// Files to cache on install
const LAUNCHER_STATIC_CACHE_URLS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Launcher Service Worker installing...');
  
  event.waitUntil(
    caches.open(LAUNCHER_CACHE_NAME)
      .then((cache) => {
        console.log('Caching launcher static assets...');
        return cache.addAll(LAUNCHER_STATIC_CACHE_URLS.map(url => new Request(url, {
          credentials: 'same-origin'
        })));
      })
      .then(() => {
        console.log('Launcher static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Failed to cache launcher static assets:', error);
      })
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  console.log('Launcher Service Worker activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== LAUNCHER_CACHE_NAME && cacheName !== LAUNCHER_RUNTIME_CACHE) {
            console.log('Deleting old launcher cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Launcher Service Worker activated');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  if (request.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }
  
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        return fetch(request)
          .then((networkResponse) => {
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            
            const responseToCache = networkResponse.clone();
            caches.open(LAUNCHER_RUNTIME_CACHE)
              .then((cache) => {
                cache.put(request, responseToCache);
              });
            
            return networkResponse;
          })
          .catch((error) => {
            console.error('Launcher fetch failed:', error);
            if (request.mode === 'navigate') {
              return caches.match('/');
            }
            throw error;
          });
      })
  );
});

// Message handler for launcher update control
self.addEventListener('message', (event) => {
  const { type } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
    case 'LAUNCHER_SKIP_WAITING':
      console.log('Force updating launcher service worker...');
      self.skipWaiting();
      break;
      
    case 'CHECK_UPDATE':
    case 'LAUNCHER_CHECK_UPDATE':
      console.log('Checking for launcher updates...');
      checkForLauncherUpdates().then((hasUpdate) => {
        event.ports[0].postMessage({
          type: 'UPDATE_CHECK_RESULT',
          payload: { hasUpdate }
        });
      });
      break;
      
    case 'FORCE_UPDATE':
    case 'LAUNCHER_FORCE_UPDATE':
      console.log('Force updating launcher app...');
      forceLauncherUpdate().then(() => {
        event.ports[0].postMessage({
          type: 'UPDATE_COMPLETED'
        });
      });
      break;
      
    case 'CLEAR_CACHE':
    case 'LAUNCHER_CLEAR_CACHE':
      console.log('Clearing all launcher caches...');
      clearAllLauncherCaches().then(() => {
        event.ports[0].postMessage({
          type: 'CACHE_CLEARED'
        });
      });
      break;
  }
});

// Check for launcher updates by comparing build time
async function checkForLauncherUpdates() {
  try {
    const response = await fetch('/manifest.json', { 
      cache: 'no-cache',
      credentials: 'same-origin'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch launcher manifest');
    }
    
    const manifest = await response.json();
    const currentBuildTime = manifest.build_time;
    
    const stored = await caches.open(LAUNCHER_CACHE_NAME);
    const cachedManifest = await stored.match('/manifest.json');
    
    if (cachedManifest) {
      const cachedData = await cachedManifest.json();
      const cachedBuildTime = cachedData.build_time;
      return currentBuildTime !== cachedBuildTime;
    }
    
    return true;
  } catch (error) {
    console.error('Launcher update check failed:', error);
    return false;
  }
}

// Force launcher update by clearing caches and reloading
async function forceLauncherUpdate() {
  try {
    await clearAllLauncherCaches();
    
    const clients = await self.clients.matchAll();
    clients.forEach((client) => {
      client.postMessage({
        type: 'FORCE_RELOAD'
      });
    });
    
    console.log('Launcher force update completed');
  } catch (error) {
    console.error('Launcher force update failed:', error);
  }
}

// Clear all launcher caches
async function clearAllLauncherCaches() {
  try {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map((cacheName) => caches.delete(cacheName))
    );
    console.log('All launcher caches cleared');
  } catch (error) {
    console.error('Failed to clear launcher caches:', error);
  }
}

console.log('Launcher Bridge Service Worker loaded successfully');