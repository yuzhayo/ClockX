import React, { useState, useEffect } from 'react';
import { SettingScreenProps } from './LauncherIndex';
import { SettingsManager, AppSettings, DEFAULT_SETTINGS } from './LauncherSettingsManager';
import { useUpdateManager } from './LauncherUpdateManager';

const SettingScreen: React.FC<SettingScreenProps> = ({ 
  isVisible, 
  onClose, 
  onSave 
}) => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const { status: updateStatus, forceUpdate, checkForUpdates } = useUpdateManager();

  // Load settings on mount
  useEffect(() => {
    const loadedSettings = SettingsManager.loadSettings();
    setSettings(loadedSettings);
  }, []);

  // Update setting and mark as changed
  const updateSetting = <K extends keyof AppSettings>(
    group: K, 
    key: keyof AppSettings[K], 
    value: any
  ) => {
    setSettings(prev => ({
      ...prev,
      [group]: {
        ...(prev[group] as any),
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  // Handle save
  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      const success = SettingsManager.saveSettings(settings);
      if (success) {
        setSaveStatus('success');
        setHasChanges(false);
        onSave(); // Call parent callback
        
        // Reset status after 2 seconds
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 3000);
      }
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  // Handle update button
  const handleUpdate = async () => {
    try {
      await forceUpdate();
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  if (!isVisible) return null;

  // Setting components
  const ToggleSetting = ({ label, value, onChange, description }: {
    label: string;
    value: boolean;
    onChange: (value: boolean) => void;
    description?: string;
  }) => (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
        <span style={{ color: '#e5e5e5', fontSize: '14px' }}>{label}</span>
        <button
          onClick={() => onChange(!value)}
          style={{
            width: '44px',
            height: '24px',
            backgroundColor: value ? '#2563eb' : 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            position: 'relative',
            transition: 'background-color 0.2s'
          }}
        >
          <div
            style={{
              width: '20px',
              height: '20px',
              backgroundColor: 'white',
              borderRadius: '50%',
              position: 'absolute',
              top: '2px',
              left: value ? '22px' : '2px',
              transition: 'left 0.2s'
            }}
          />
        </button>
      </div>
      {description && (
        <p style={{ color: '#888', fontSize: '12px', margin: 0 }}>{description}</p>
      )}
    </div>
  );

  const SelectSetting = ({ label, value, options, onChange, description }: {
    label: string;
    value: string;
    options: { value: string; label: string }[];
    onChange: (value: string) => void;
    description?: string;
  }) => (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ color: '#e5e5e5', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '8px 12px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '6px',
          color: 'white',
          fontSize: '14px'
        }}
      >
        {options.map(option => (
          <option key={option.value} value={option.value} style={{ backgroundColor: '#1a1a1a' }}>
            {option.label}
          </option>
        ))}
      </select>
      {description && (
        <p style={{ color: '#888', fontSize: '12px', margin: '4px 0 0 0' }}>{description}</p>
      )}
    </div>
  );

  const NumberSetting = ({ label, value, min, max, onChange, description }: {
    label: string;
    value: number;
    min: number;
    max: number;
    onChange: (value: number) => void;
    description?: string;
  }) => (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ color: '#e5e5e5', fontSize: '14px' }}>{label}</span>
        <span style={{ color: '#888', fontSize: '12px' }}>{value}ms</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step="50"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        style={{
          width: '100%',
          height: '6px',
          borderRadius: '3px',
          background: `linear-gradient(to right, #2563eb 0%, #2563eb ${((value - min) / (max - min)) * 100}%, rgba(255, 255, 255, 0.2) ${((value - min) / (max - min)) * 100}%, rgba(255, 255, 255, 0.2) 100%)`,
          outline: 'none',
          cursor: 'pointer'
        }}
      />
      {description && (
        <p style={{ color: '#888', fontSize: '12px', margin: '4px 0 0 0' }}>{description}</p>
      )}
    </div>
  );

  return (
    <div
      className="setting-screen"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '25%',
        height: '100vh',
        backgroundColor: 'rgba(26, 26, 26, 0.95)',
        backdropFilter: 'blur(10px)',
        zIndex: 999,
        display: 'flex',
        flexDirection: 'column',
        borderRight: '2px solid rgba(255, 255, 255, 0.2)'
      }}
    >
      {/* Top Controls */}
      <div
        className="controls"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 20px',
          backgroundColor: 'rgba(26, 26, 26, 0.9)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* Save Settings Button */}
        <button
          onClick={handleSave}
          disabled={!hasChanges || saveStatus === 'saving'}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px 12px',
            backgroundColor: hasChanges ? '#2563eb' : 'rgba(37, 99, 235, 0.5)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: hasChanges ? 'pointer' : 'not-allowed',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'background-color 0.2s',
            opacity: saveStatus === 'saving' ? 0.7 : 1
          }}
        >
          {saveStatus === 'saving' ? 'Saving...' : 
           saveStatus === 'success' ? '✓ Saved' :
           saveStatus === 'error' ? '✗ Error' : 'Save Settings'}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Update Button */}
          <button
            onClick={handleUpdate}
            disabled={updateStatus.isUpdating}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px 12px',
              backgroundColor: updateStatus.isUpdateAvailable ? '#16a34a' : 
                             updateStatus.isUpdating ? '#ea580c' : 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '6px',
              cursor: updateStatus.isUpdating ? 'not-allowed' : 'pointer',
              color: 'white',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
            title={updateStatus.isUpdateAvailable ? 'Update available!' : 
                   updateStatus.isUpdating ? 'Updating...' : 'Check for updates'}
          >
            {updateStatus.isUpdating ? 'Updating...' : 
             updateStatus.isUpdateAvailable ? '🚀 Update' : 'Update'}
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px 12px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              color: 'white',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            X
          </button>
        </div>
      </div>

      {/* Settings Content */}
      <div style={{ 
        flex: 1, 
        padding: '20px',
        overflowY: 'auto'
      }}>
        {/* Group 1 - Display Settings */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{
            color: '#e5e5e5',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '16px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Display Settings
          </h3>
          
          <div style={{
            padding: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <SelectSetting
              label="Theme"
              value={settings.display.theme}
              options={[
                { value: 'dark', label: 'Dark' },
                { value: 'light', label: 'Light' },
                { value: 'auto', label: 'Auto' }
              ]}
              onChange={(value) => updateSetting('display', 'theme', value as any)}
              description="Choose your preferred color scheme"
            />
            
            <SelectSetting
              label="Font Size"
              value={settings.display.fontSize}
              options={[
                { value: 'small', label: 'Small' },
                { value: 'medium', label: 'Medium' },
                { value: 'large', label: 'Large' }
              ]}
              onChange={(value) => updateSetting('display', 'fontSize', value as any)}
              description="Adjust text size for better readability"
            />
            
            <ToggleSetting
              label="Animations"
              value={settings.display.animations}
              onChange={(value) => updateSetting('display', 'animations', value)}
              description="Enable smooth transitions and animations"
            />
            
            <ToggleSetting
              label="Blur Effects"
              value={settings.display.blurEffects}
              onChange={(value) => updateSetting('display', 'blurEffects', value)}
              description="Apply backdrop blur to panels"
            />
          </div>
        </div>

        {/* Group 2 - Gesture Settings */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{
            color: '#e5e5e5',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '16px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Gesture Settings
          </h3>
          
          <div style={{
            padding: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <ToggleSetting
              label="Triple-tap Enabled"
              value={settings.gestures.tripleTabEnabled}
              onChange={(value) => updateSetting('gestures', 'tripleTabEnabled', value)}
              description="Enable triple-tap to open settings panel"
            />
            
            <SelectSetting
              label="Tap Sensitivity"
              value={settings.gestures.tapSensitivity}
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' }
              ]}
              onChange={(value) => updateSetting('gestures', 'tapSensitivity', value as any)}
              description="Adjust gesture detection sensitivity"
            />
            
            <NumberSetting
              label="Gesture Timeout"
              value={settings.gestures.gestureTimeout}
              min={300}
              max={1500}
              onChange={(value) => updateSetting('gestures', 'gestureTimeout', value)}
              description="Time window for multi-tap gestures"
            />
            
            <ToggleSetting
              label="Vibration Feedback"
              value={settings.gestures.vibrationFeedback}
              onChange={(value) => updateSetting('gestures', 'vibrationFeedback', value)}
              description="Vibrate on gesture recognition (mobile)"
            />
          </div>
        </div>

        {/* Group 3 - Performance Settings */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{
            color: '#e5e5e5',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '16px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Performance
          </h3>
          
          <div style={{
            padding: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <ToggleSetting
              label="Cache Enabled"
              value={settings.performance.cacheEnabled}
              onChange={(value) => updateSetting('performance', 'cacheEnabled', value)}
              description="Enable caching for faster loading"
            />
            
            <ToggleSetting
              label="Auto Updates"
              value={settings.performance.autoUpdates}
              onChange={(value) => updateSetting('performance', 'autoUpdates', value)}
              description="Automatically check for app updates"
            />
            
            <ToggleSetting
              label="Background Sync"
              value={settings.performance.backgroundSync}
              onChange={(value) => updateSetting('performance', 'backgroundSync', value)}
              description="Sync data in the background"
            />
            
            <ToggleSetting
              label="Debug Mode"
              value={settings.performance.debugMode}
              onChange={(value) => updateSetting('performance', 'debugMode', value)}
              description="Show debug information in console"
            />
          </div>
        </div>

        {/* Group 4 - Advanced Settings */}
        <div>
          <h3 style={{
            color: '#e5e5e5',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '16px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Advanced
          </h3>
          
          <div style={{
            padding: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <ToggleSetting
              label="Settings Backup"
              value={settings.advanced.settingsBackup}
              onChange={(value) => updateSetting('advanced', 'settingsBackup', value)}
              description="Automatically backup settings to cloud"
            />
            
            <ToggleSetting
              label="Export/Import"
              value={settings.advanced.exportImport}
              onChange={(value) => updateSetting('advanced', 'exportImport', value)}
              description="Enable settings export and import"
            />
            
            <ToggleSetting
              label="Reset on Update"
              value={settings.advanced.resetOnUpdate}
              onChange={(value) => updateSetting('advanced', 'resetOnUpdate', value)}
              description="Reset settings when app updates"
            />
            
            <ToggleSetting
              label="Developer Mode"
              value={settings.advanced.developerMode}
              onChange={(value) => updateSetting('advanced', 'developerMode', value)}
              description="Show developer tools and options"
            />
          </div>
        </div>

        {/* Status Info */}
        <div style={{
          marginTop: '24px',
          padding: '12px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '6px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>
            App Version: {settings.version}
          </div>
          <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>
            Settings Schema: {settings.settingsSchema}
          </div>
          <div style={{ fontSize: '12px', color: '#888' }}>
            Update Status: {updateStatus.isUpdateAvailable ? '🟢 Available' : 
                           updateStatus.isUpdating ? '🟡 Updating' : '🔵 Up to date'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingScreen;