import React, { useState, useEffect } from 'react';
import { SettingScreenProps } from './LauncherIndex';
import { SettingsManager, AppSettings, DEFAULT_SETTINGS } from './LauncherSettingsManager';
import LauncherSettingScreenButton from './LauncherSettingScreenButton';
import LauncherSettingScreenContent from './LauncherSettingScreenContent';
import LauncherSettingScreenFloatingIcon from './LauncherSettingScreenFloatingIcon';
import LauncherSettingScreenDragHandler from './LauncherSettingScreenDragHandler';
import LauncherSettingScreenPinchZoom from './LauncherSettingScreenPinchZoom';

const SettingScreen: React.FC<SettingScreenProps> = ({ 
  isVisible, 
  onClose, 
  onSave 
}) => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [isExpanded, setIsExpanded] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [position, setPosition] = useState({ x: 60, y: 60 });

  // Load settings on mount
  useEffect(() => {
    const loadedSettings = SettingsManager.loadSettings();
    setSettings(loadedSettings);
  }, []);

  // Update setting and mark as changed
  const updateSetting = (
    group: keyof AppSettings, 
    key: keyof AppSettings[keyof AppSettings], 
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
        zIndex: 999,
        display: 'flex',
        flexDirection: 'column',
        borderRight: '2px solid rgba(255, 255, 255, 0.2)'
      }}
    >
      {/* Top Controls - Extracted to separate component */}
      <LauncherSettingScreenButton
        hasChanges={hasChanges}
        saveStatus={saveStatus}
        onSave={handleSave}
        onClose={onClose}
      />

      {/* Settings Content - Extracted to separate component */}
      <LauncherSettingScreenContent
        settings={settings}
        updateSetting={updateSetting}
      />
    </div>
  );
};

export default SettingScreen;