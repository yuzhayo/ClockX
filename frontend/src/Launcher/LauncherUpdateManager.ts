// Service Worker Utilities for Update Management
// Client-side utilities to interact with service worker

export interface UpdateStatus {
  isUpdateAvailable: boolean;
  isUpdating: boolean;
  isUpToDate: boolean;
  lastChecked: Date | null;
}

export class UpdateManager {
  private static instance: UpdateManager;
  private serviceWorker: ServiceWorker | null = null;
  private callbacks: ((status: UpdateStatus) => void)[] = [];
  private status: UpdateStatus = {
    isUpdateAvailable: false,
    isUpdating: false,
    isUpToDate: false,
    lastChecked: null
  };
  
  private constructor() {
    this.init();
  }
  
  static getInstance(): UpdateManager {
    if (!UpdateManager.instance) {
      UpdateManager.instance = new UpdateManager();
    }
    return UpdateManager.instance;
  }
  
  // Initialize service worker and update detection
  private async init() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/launcher-service-worker.js', {
          scope: '/'
        });
        
        console.log('Launcher Service Worker registered:', registration);
        
        // Handle updates
        registration.addEventListener('updatefound', () => {
          console.log('New service worker found');
          const newWorker = registration.installing;
          
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // New update available
                  console.log('Update available');
                  this.updateStatus({ isUpdateAvailable: true });
                } else {
                  // First install
                  console.log('Service worker installed for first time');
                  this.updateStatus({ isUpToDate: true });
                }
              }
            });
          }
        });
        
        // Listen for messages from service worker
        navigator.serviceWorker.addEventListener('message', (event) => {
          this.handleServiceWorkerMessage(event);
        });
        
        // Check for immediate updates
        this.checkForUpdates();
        
        // Set up periodic update checks (every 5 minutes)
        setInterval(() => {
          this.checkForUpdates();
        }, 5 * 60 * 1000);
        
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    } else {
      console.warn('Service Worker not supported');
    }
  }
  
  // Handle messages from service worker
  private handleServiceWorkerMessage(event: MessageEvent) {
    const { type, payload } = event.data;
    
    switch (type) {
      case 'UPDATE_CHECK_RESULT':
        this.updateStatus({
          isUpdateAvailable: payload.hasUpdate,
          lastChecked: new Date()
        });
        break;
        
      case 'UPDATE_AVAILABLE':
        this.updateStatus({ isUpdateAvailable: true });
        break;
        
      case 'UPDATE_COMPLETED':
        this.updateStatus({
          isUpdating: false,
          isUpToDate: true,
          isUpdateAvailable: false
        });
        // Force page reload
        window.location.reload();
        break;
        
      case 'FORCE_RELOAD':
        console.log('Forced reload requested by service worker');
        window.location.reload();
        break;
        
      case 'CACHE_CLEARED':
        console.log('Cache cleared by service worker');
        break;
        
      default:
        console.log('Unknown service worker message:', type);
    }
  }
  
  // Update status and notify callbacks
  private updateStatus(update: Partial<UpdateStatus>) {
    this.status = { ...this.status, ...update };
    this.callbacks.forEach(callback => callback(this.status));
  }
  
  // Subscribe to status changes
  onStatusChange(callback: (status: UpdateStatus) => void): () => void {
    this.callbacks.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.callbacks.indexOf(callback);
      if (index > -1) {
        this.callbacks.splice(index, 1);
      }
    };
  }
  
  // Get current status
  getStatus(): UpdateStatus {
    return { ...this.status };
  }
  
  // Check for updates manually
  async checkForUpdates(): Promise<boolean> {
    return new Promise((resolve) => {
      if (!navigator.serviceWorker.controller) {
        resolve(false);
        return;
      }
      
      const channel = new MessageChannel();
      channel.port1.onmessage = (event) => {
        const { type, payload } = event.data;
        if (type === 'UPDATE_CHECK_RESULT') {
          resolve(payload.hasUpdate);
        }
      };
      
      navigator.serviceWorker.controller.postMessage({
        type: 'CHECK_UPDATE'
      }, [channel.port2]);
      
      // Timeout after 10 seconds
      setTimeout(() => resolve(false), 10000);
    });
  }
  
  // Force update the app
  async forceUpdate(): Promise<void> {
    this.updateStatus({ isUpdating: true });
    
    return new Promise((resolve) => {
      if (!navigator.serviceWorker.controller) {
        this.updateStatus({ isUpdating: false });
        window.location.reload(); // Fallback
        resolve();
        return;
      }
      
      const channel = new MessageChannel();
      channel.port1.onmessage = (event) => {
        const { type } = event.data;
        if (type === 'UPDATE_COMPLETED') {
          resolve();
        }
      };
      
      navigator.serviceWorker.controller.postMessage({
        type: 'FORCE_UPDATE'
      }, [channel.port2]);
      
      // Fallback timeout
      setTimeout(() => {
        console.log('Update timeout, forcing reload...');
        this.updateStatus({ isUpdating: false });
        window.location.reload();
        resolve();
      }, 30000); // 30 second timeout
    });
  }
  
  // Clear all caches
  async clearCache(): Promise<void> {
    return new Promise((resolve) => {
      if (!navigator.serviceWorker.controller) {
        resolve();
        return;
      }
      
      const channel = new MessageChannel();
      channel.port1.onmessage = (event) => {
        const { type } = event.data;
        if (type === 'CACHE_CLEARED') {
          resolve();
        }
      };
      
      navigator.serviceWorker.controller.postMessage({
        type: 'CLEAR_CACHE'
      }, [channel.port2]);
      
      // Timeout after 10 seconds
      setTimeout(() => resolve(), 10000);
    });
  }
  
  // Install prompt for PWA
  async installApp(): Promise<boolean> {
    if ('beforeinstallprompt' in window) {
      try {
        const event = (window as any).deferredPrompt;
        if (event) {
          event.prompt();
          const { outcome } = await event.userChoice;
          return outcome === 'accepted';
        }
      } catch (error) {
        console.error('App install failed:', error);
      }
    }
    return false;
  }
}

// React hook for using update manager
export function useUpdateManager() {
  const [status, setStatus] = React.useState<UpdateStatus>({
    isUpdateAvailable: false,
    isUpdating: false,
    isUpToDate: false,
    lastChecked: null
  });
  
  React.useEffect(() => {
    const manager = UpdateManager.getInstance();
    
    // Get initial status
    setStatus(manager.getStatus());
    
    // Subscribe to changes
    const unsubscribe = manager.onStatusChange(setStatus);
    
    return unsubscribe;
  }, []);
  
  const manager = UpdateManager.getInstance();
  
  return {
    status,
    checkForUpdates: () => manager.checkForUpdates(),
    forceUpdate: () => manager.forceUpdate(),
    clearCache: () => manager.clearCache(),
    installApp: () => manager.installApp()
  };
}

// Add React import for the hook
import React from 'react';

export default UpdateManager;