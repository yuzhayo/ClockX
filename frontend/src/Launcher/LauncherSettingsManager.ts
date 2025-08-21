// App Version and Settings Management System
// Handles version tracking, settings migration, and localStorage management

export interface AppVersion {
  version: string;
  buildTime: string;
  settingsSchema: string;
}

export interface AppSettings {
  version: string;
  buildTime: string;
  settingsSchema: string;
  
  // Group 1 - Display Settings
  display: {
    theme: 'dark' | 'light' | 'auto';
    fontSize: 'small' | 'medium' | 'large';
    animations: boolean;
    blurEffects: boolean;
  };
  
  // Group 2 - Gesture Settings  
  gestures: {
    tripleTabEnabled: boolean;
    tapSensitivity: 'low' | 'medium' | 'high';
    gestureTimeout: number; // milliseconds
    vibrationFeedback: boolean;
  };
  
  // Group 3 - Performance Settings
  performance: {
    cacheEnabled: boolean;
    autoUpdates: boolean;
    backgroundSync: boolean;
    debugMode: boolean;
  };
  
  // Group 4 - Advanced Settings
  advanced: {
    settingsBackup: boolean;
    exportImport: boolean;
    resetOnUpdate: boolean;
    developerMode: boolean;
  };
}

// Default settings configuration
export const DEFAULT_SETTINGS: AppSettings = {
  version: process.env.REACT_APP_VERSION || '1.0.2',
  buildTime: process.env.REACT_APP_BUILD_TIME || new Date().toISOString(),
  settingsSchema: '1.0',
  
  display: {
    theme: 'dark',
    fontSize: 'medium', 
    animations: true,
    blurEffects: true
  },
  
  gestures: {
    tripleTabEnabled: true,
    tapSensitivity: 'medium',
    gestureTimeout: 800,
    vibrationFeedback: false
  },
  
  performance: {
    cacheEnabled: true,
    autoUpdates: true,
    backgroundSync: true,
    debugMode: false
  },
  
  advanced: {
    settingsBackup: true,
    exportImport: false,
    resetOnUpdate: false,
    developerMode: false
  }
};

// Settings Manager Class
export class SettingsManager {
  private static readonly STORAGE_KEY = 'launcher_app_settings';
  private static readonly VERSION_KEY = 'launcher_app_version';
  
  // Get current app version
  static getCurrentVersion(): AppVersion {
    return {
      version: process.env.REACT_APP_VERSION || '1.0.1',
      buildTime: process.env.REACT_APP_BUILD_TIME || new Date().toISOString(),
      settingsSchema: '1.0'
    };
  }
  
  // Load settings from localStorage
  static loadSettings(): AppSettings {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) {
        return DEFAULT_SETTINGS;
      }
      
      const parsed = JSON.parse(stored) as AppSettings;
      const currentVersion = this.getCurrentVersion();
      
      // Check if settings need migration
      if (this.needsMigration(parsed, currentVersion)) {
        return this.migrateSettings(parsed, currentVersion);
      }
      
      return parsed;
    } catch (error) {
      console.warn('Failed to load settings, using defaults:', error);
      return DEFAULT_SETTINGS;
    }
  }
  
  // Save settings to localStorage
  static saveSettings(settings: AppSettings): boolean {
    try {
      // Update version info
      const currentVersion = this.getCurrentVersion();
      const updatedSettings = {
        ...settings,
        version: currentVersion.version,
        buildTime: currentVersion.buildTime,
        settingsSchema: currentVersion.settingsSchema
      };
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedSettings));
      localStorage.setItem(this.VERSION_KEY, JSON.stringify(currentVersion));
      
      // Dispatch event for components to react to settings change
      window.dispatchEvent(new CustomEvent('settingsChanged', { 
        detail: updatedSettings 
      }));
      
      return true;
    } catch (error) {
      console.error('Failed to save settings:', error);
      return false;
    }
  }
  
  // Check if settings need migration
  private static needsMigration(stored: AppSettings, current: AppVersion): boolean {
    return stored.version !== current.version || 
           stored.settingsSchema !== current.settingsSchema;
  }
  
  // Migrate settings between versions
  private static migrateSettings(old: AppSettings, current: AppVersion): AppSettings {
    console.log(`Migrating settings from ${old.version} to ${current.version}`);
    
    // Create new settings with defaults, then merge old values
    const migrated: AppSettings = {
      ...DEFAULT_SETTINGS,
      version: current.version,
      buildTime: current.buildTime,
      settingsSchema: current.settingsSchema
    };
    
    // Merge old settings where compatible
    try {
      // Display settings
      if (old.display) {
        migrated.display = { ...migrated.display, ...old.display };
      }
      
      // Gesture settings
      if (old.gestures) {
        migrated.gestures = { ...migrated.gestures, ...old.gestures };
      }
      
      // Performance settings
      if (old.performance) {
        migrated.performance = { ...migrated.performance, ...old.performance };
      }
      
      // Advanced settings
      if (old.advanced) {
        migrated.advanced = { ...migrated.advanced, ...old.advanced };
      }
      
      console.log('Settings migration completed successfully');
    } catch (error) {
      console.warn('Settings migration failed, using defaults:', error);
      return DEFAULT_SETTINGS;
    }
    
    return migrated;
  }
  
  // Reset settings to defaults
  static resetSettings(): AppSettings {
    const current = this.getCurrentVersion();
    const reset = {
      ...DEFAULT_SETTINGS,
      version: current.version,
      buildTime: current.buildTime,
      settingsSchema: current.settingsSchema
    };
    
    this.saveSettings(reset);
    return reset;
  }
  
  // Export settings for backup
  static exportSettings(): string {
    const settings = this.loadSettings();
    return JSON.stringify(settings, null, 2);
  }
  
  // Import settings from backup
  static importSettings(data: string): boolean {
    try {
      const imported = JSON.parse(data) as AppSettings;
      const current = this.getCurrentVersion();
      
      // Validate imported data
      if (!imported || typeof imported !== 'object') {
        throw new Error('Invalid settings data');
      }
      
      // Migrate if needed
      const settings = this.needsMigration(imported, current) 
        ? this.migrateSettings(imported, current)
        : imported;
      
      return this.saveSettings(settings);
    } catch (error) {
      console.error('Failed to import settings:', error);
      return false;
    }
  }
}