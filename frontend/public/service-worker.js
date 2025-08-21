// Bridge Service Worker - Acts as bridge to Launcher Service Worker
// This file stays in public folder but references Launcher module

// Import launcher service worker logic
importScripts('/static/js/launcher-service-worker-bridge.js');

// Initialize launcher service worker
console.log('Bridge Service Worker loaded - initializing Launcher Service Worker...');