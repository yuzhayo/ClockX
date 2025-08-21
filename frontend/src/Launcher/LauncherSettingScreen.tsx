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
  const updateSetting = <K extends keyof AppSettings, S extends keyof AppSettings[K]>(
    group: K, 
    key: S, 
    value: AppSettings[K][S]
  ) => {
    setSettings(prev => ({
      ...prev,
      [group]: {
        ...prev[group],
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
        zIndex: 999, // Lower z-index to avoid overlapping
        display: 'flex',
        flexDirection: 'column',
        borderRight: '2px solid rgba(255, 255, 255, 0.2)' // More visible border
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
          onClick={onSave}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px 12px',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#1d4ed8';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#2563eb';
          }}
        >
          Save Settings
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Update Button */}
          <button
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
            Update
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
        {/* Group 1 Section */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{
            color: '#e5e5e5',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '16px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Group 1
          </h3>
          
          <div style={{
            padding: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center'
          }}>
            <span style={{ 
              color: '#888', 
              fontSize: '14px',
              fontStyle: 'italic'
            }}>
              Group 1 Content
            </span>
          </div>
        </div>

        {/* Group 2 Section */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{
            color: '#e5e5e5',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '16px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Group 2
          </h3>
          
          <div style={{
            padding: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center'
          }}>
            <span style={{ 
              color: '#888', 
              fontSize: '14px',
              fontStyle: 'italic'
            }}>
              Group 2 Content
            </span>
          </div>
        </div>

        {/* Group 3 Section */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{
            color: '#e5e5e5',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '16px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Group 3
          </h3>
          
          <div style={{
            padding: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center'
          }}>
            <span style={{ 
              color: '#888', 
              fontSize: '14px',
              fontStyle: 'italic'
            }}>
              Group 3 Content
            </span>
          </div>
        </div>

        {/* Group 4 Section */}
        <div>
          <h3 style={{
            color: '#e5e5e5',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '16px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Group 4
          </h3>
          
          <div style={{
            padding: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center'
          }}>
            <span style={{ 
              color: '#888', 
              fontSize: '14px',
              fontStyle: 'italic'
            }}>
              Group 4 Content
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingScreen;