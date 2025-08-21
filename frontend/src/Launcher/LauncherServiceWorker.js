// Launcher Service Worker - Standalone Module
// Handles caching, update detection, and forced refreshes for Launcher App

const LAUNCHER_CACHE_NAME = 'launcher-app-v1';
const LAUNCHER_RUNTIME_CACHE = 'launcher-runtime';

// Files to cache on install
const LAUNCHER_STATIC_CACHE_URLS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

export class LauncherServiceWorker {
  
  // Initialize service worker
  static init() {
    if (typeof window === 'undefined') {
      // Running in service worker context
      this.setupServiceWorkerEvents();
    } else {
      // Running in main thread - register service worker
      this.registerServiceWorker();
    }
  }
  
  // Register service worker from main thread
  static async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/launcher-service-worker.js', {
          scope: '/'
        });
        
        console.log('Launcher Service Worker registered:', registration);
        return registration;
      } catch (error) {
        console.error('Launcher Service Worker registration failed:', error);
        return null;
      }
    }
    return null;
  }
  
  // Set up service worker event listeners (runs in SW context)
  static setupServiceWorkerEvents() {
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
            // Force activation
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
                caches.open(LAUNCHER_RUNTIME_CACHE)
                  .then((cache) => {
                    cache.put(request, responseToCache);
                  });
                
                return networkResponse;
              })
              .catch((error) => {
                console.error('Launcher fetch failed:', error);
                
                // Return offline fallback for navigation requests
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
      const { type, payload } = event.data;
      
      switch (type) {
        case 'LAUNCHER_SKIP_WAITING':
          console.log('Force updating launcher service worker...');
          self.skipWaiting();
          break;
          
        case 'LAUNCHER_CHECK_UPDATE':
          console.log('Checking for launcher updates...');
          this.checkForLauncherUpdates().then((hasUpdate) => {
            event.ports[0].postMessage({
              type: 'LAUNCHER_UPDATE_CHECK_RESULT',
              payload: { hasUpdate }
            });
          });
          break;
          
        case 'LAUNCHER_FORCE_UPDATE':
          console.log('Force updating launcher app...');
          this.forceLauncherUpdate().then(() => {
            event.ports[0].postMessage({
              type: 'LAUNCHER_UPDATE_COMPLETED'
            });
          });
          break;
          
        case 'LAUNCHER_CLEAR_CACHE':
          console.log('Clearing all launcher caches...');
          this.clearAllLauncherCaches().then(() => {
            event.ports[0].postMessage({
              type: 'LAUNCHER_CACHE_CLEARED'
            });
          });
          break;
          
        default:
          console.log('Unknown launcher message type:', type);
      }
    });
  }
  
  // Check for launcher updates by comparing build time
  static async checkForLauncherUpdates() {
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
      
      // Get stored build time
      const stored = await caches.open(LAUNCHER_CACHE_NAME);
      const cachedManifest = await stored.match('/manifest.json');
      
      if (cachedManifest) {
        const cachedData = await cachedManifest.json();
        const cachedBuildTime = cachedData.build_time;
        
        // Compare build times
        return currentBuildTime !== cachedBuildTime;
      }
      
      return true; // No cached version, assume update available
    } catch (error) {
      console.error('Launcher update check failed:', error);
      return false;
    }
  }

  // Force launcher update by clearing caches and reloading
  static async forceLauncherUpdate() {
    try {
      // Clear all launcher caches
      await this.clearAllLauncherCaches();
      
      // Notify all clients to reload
      const clients = await self.clients.matchAll();
      clients.forEach((client) => {
        client.postMessage({
          type: 'LAUNCHER_FORCE_RELOAD'
        });
      });
      
      console.log('Launcher force update completed');
    } catch (error) {
      console.error('Launcher force update failed:', error);
    }
  }

  // Clear all launcher caches
  static async clearAllLauncherCaches() {
    try {
      const cacheNames = await caches.keys();
      const launcherCaches = cacheNames.filter(name => 
        name.includes('launcher') || name === LAUNCHER_CACHE_NAME || name === LAUNCHER_RUNTIME_CACHE
      );
      
      await Promise.all(
        launcherCaches.map((cacheName) => caches.delete(cacheName))
      );
      console.log('All launcher caches cleared');
    } catch (error) {
      console.error('Failed to clear launcher caches:', error);
    }
  }
}

// Initialize when script loads
LauncherServiceWorker.init();

// Export for bridge files
export default LauncherServiceWorker;