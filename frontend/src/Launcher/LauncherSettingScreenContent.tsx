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
        <div style={{
          padding: '16px',
          textAlign: 'center'
        }}>
          <span style={{ 
            color: '#888', 
            fontSize: '14px',
            fontStyle: 'italic'
          }}>
            Display Settings Content
          </span>
        </div>
      </DropdownGroup>

      {/* Gesture Settings Group */}
      <DropdownGroup title="Gesture Settings" groupKey="gestures">
        <div style={{
          padding: '16px',
          textAlign: 'center'
        }}>
          <span style={{ 
            color: '#888', 
            fontSize: '14px',
            fontStyle: 'italic'
          }}>
            Gesture Settings Content
          </span>
        </div>
      </DropdownGroup>

      {/* Performance Settings Group */}
      <DropdownGroup title="Performance" groupKey="performance">
        <div style={{
          padding: '16px',
          textAlign: 'center'
        }}>
          <span style={{ 
            color: '#888', 
            fontSize: '14px',
            fontStyle: 'italic'
          }}>
            Performance Content
          </span>
        </div>
      </DropdownGroup>

      {/* Advanced Settings Group */}
      <DropdownGroup title="Advanced" groupKey="advanced">
        <div style={{
          padding: '16px',
          textAlign: 'center'
        }}>
          <span style={{ 
            color: '#888', 
            fontSize: '14px',
            fontStyle: 'italic'
          }}>
            Advanced Content
          </span>
        </div>
      </DropdownGroup>

      {/* Status Info - Keep App Version */}
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