import React, { useState } from 'react';
import { AppSettings } from './LauncherSettingsManager';

interface LauncherSettingScreenContentProps {
  settings: AppSettings;
  updateSetting: (group: keyof AppSettings, key: keyof AppSettings[keyof AppSettings], value: any) => void;
}

const LauncherSettingScreenContent: React.FC<LauncherSettingScreenContentProps> = ({
  settings,
  updateSetting
}) => {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    display: true,
    gestures: false,
    performance: false,
    advanced: false
  });

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

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

  const DropdownGroup = ({ title, groupKey, children }: {
    title: string;
    groupKey: string;
    children: React.ReactNode;
  }) => {
    const isExpanded = expandedGroups[groupKey];
    
    return (
      <div style={{ marginBottom: '16px' }}>
        {/* Dropdown Header */}
        <button
          onClick={() => toggleGroup(groupKey)}
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '8px',
            cursor: 'pointer',
            color: '#e5e5e5',
            fontSize: '14px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
          }}
        >
          <span>{title}</span>
          <span style={{
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            fontSize: '16px'
          }}>
            ▼
          </span>
        </button>

        {/* Dropdown Content */}
        <div
          style={{
            maxHeight: isExpanded ? '1000px' : '0px',
            overflow: 'hidden',
            transition: 'max-height 0.3s ease',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '0 0 8px 8px',
            marginTop: isExpanded ? '0px' : '-8px'
          }}
        >
          <div style={{ padding: isExpanded ? '16px' : '0 16px' }}>
            {children}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="launcher-settings-content" style={{ 
      flex: 1, 
      padding: '20px',
      overflowY: 'auto'
    }}>
      {/* Display Settings Group */}
      <DropdownGroup title="Display Settings" groupKey="display">
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
      </DropdownGroup>

      {/* Gesture Settings Group */}
      <DropdownGroup title="Gesture Settings" groupKey="gestures">
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
      </DropdownGroup>

      {/* Performance Settings Group */}
      <DropdownGroup title="Performance" groupKey="performance">
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
      </DropdownGroup>

      {/* Advanced Settings Group */}
      <DropdownGroup title="Advanced" groupKey="advanced">
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
      </DropdownGroup>

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
          Last Modified: {new Date().toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default LauncherSettingScreenContent;