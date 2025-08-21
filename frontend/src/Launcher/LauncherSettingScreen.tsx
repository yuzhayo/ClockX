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

  // Handle floating icon click
  const handleIconClick = () => {
    setIsExpanded(true);
  };

  // Handle panel minimize (back to icon)
  const handleMinimize = () => {
    setIsExpanded(false);
  };

  // Handle complete close (hide entire system)
  const handleClose = () => {
    setIsExpanded(false);
    onClose();
  };

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
    <>
      {/* Floating Icon (shown when not expanded) */}
      <LauncherSettingScreenFloatingIcon
        isVisible={!isExpanded}
        onClick={handleIconClick}
      />

      {/* Floating Settings Panel (shown when expanded) */}
      {isExpanded && (
        <LauncherSettingScreenDragHandler
          position={position}
          onPositionChange={setPosition}
          dragHandle=".drag-handle"
        >
          <LauncherSettingScreenPinchZoom
            zoomLevel={zoomLevel}
            onZoomChange={setZoomLevel}
          >
            <div
              className="floating-settings-panel"
              style={{
                width: '300px',
                height: '400px',
                backgroundColor: 'rgba(26, 26, 26, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                zIndex: 999
              }}
            >
              {/* Drag Handle Header */}
              <div 
                className="drag-handle"
                style={{
                  padding: '8px 12px',
                  backgroundColor: 'rgba(37, 99, 235, 0.1)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  cursor: 'grab',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <div style={{
                  width: '4px',
                  height: '4px',
                  backgroundColor: '#666',
                  borderRadius: '50%'
                }}></div>
                <div style={{
                  width: '4px',
                  height: '4px',
                  backgroundColor: '#666',
                  borderRadius: '50%'
                }}></div>
                <div style={{
                  width: '4px',
                  height: '4px',
                  backgroundColor: '#666',
                  borderRadius: '50%'
                }}></div>
                <div style={{
                  flex: 1,
                  textAlign: 'center',
                  color: '#888',
                  fontSize: '11px',
                  fontFamily: 'monospace'
                }}>
                  Drag to move • Pinch to zoom
                </div>
              </div>

              {/* Top Controls */}
              <LauncherSettingScreenButton
                hasChanges={hasChanges}
                saveStatus={saveStatus}
                onSave={handleSave}
                onClose={handleClose}
                onMinimize={handleMinimize}
              />

              {/* Settings Content */}
              <LauncherSettingScreenContent
                settings={settings}
                updateSetting={updateSetting}
              />
            </div>
          </LauncherSettingScreenPinchZoom>
        </LauncherSettingScreenDragHandler>
      )}
    </>
  );
};

export default SettingScreen;