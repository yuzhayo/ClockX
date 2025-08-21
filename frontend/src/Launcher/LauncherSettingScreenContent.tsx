import React, { useState } from 'react';
import { AppSettings } from './LauncherSettingsManager';
import LauncherSettingContentLayer1 from './LauncherSettingContentLayer1';

interface LauncherSettingScreenContentProps {
  settings: AppSettings;
  updateSetting: (group: keyof AppSettings, key: keyof AppSettings[keyof AppSettings], value: any) => void;
}

const LauncherSettingScreenContent: React.FC<LauncherSettingScreenContentProps> = ({
  settings,
  updateSetting
}) => {
  // Manage expanded states for all dropdowns
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    mainSettings: true, // Layer1 Settings dropdown (expanded by default)
    display: false,
    gestures: false,
    performance: false,
    advanced: false
  });

  // Toggle function for managing dropdown states
  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  return (
    <div className="launcher-settings-content" style={{ 
      flex: 1, 
      padding: '12px',
      overflowY: 'auto'
    }}>
      {/* Version Info - Top Left Aligned */}
      <div style={{
        marginBottom: '20px',
        textAlign: 'left'
      }}>
        <div style={{ fontSize: '12px', color: '#888', marginBottom: '2px' }}>
          App Version: {settings.version}
        </div>
      </div>

      {/* Layer 1 - Main Settings Dropdown */}
      <LauncherSettingContentLayer1 
        settings={settings}
        updateSetting={updateSetting}
        expandedGroups={expandedGroups}
        toggleGroup={toggleGroup}
      />

      {/* Future layers can be added here */}
      
    </div>
  );
};

export default LauncherSettingScreenContent;