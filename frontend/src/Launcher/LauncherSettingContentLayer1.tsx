import React from 'react';
import { AppSettings } from './LauncherSettingsManager';

interface LauncherSettingContentLayer1Props {
  settings: AppSettings;
  updateSetting: (group: keyof AppSettings, key: keyof AppSettings[keyof AppSettings], value: any) => void;
  expandedGroups: Record<string, boolean>;
  toggleGroup: (group: string) => void;
}

const LauncherSettingContentLayer1: React.FC<LauncherSettingContentLayer1Props> = ({
  settings,
  updateSetting,
  expandedGroups,
  toggleGroup
}) => {
  const DropdownGroup = ({ title, groupKey, children }: {
    title: string;
    groupKey: string;
    children: React.ReactNode;
  }) => {
    const isExpanded = expandedGroups[groupKey];
    const isMainSettings = groupKey === 'mainSettings';
    
    // Debug logging
    console.log(`DropdownGroup: ${title}, groupKey: ${groupKey}, isMainSettings: ${isMainSettings}, isExpanded: ${isExpanded}`);
    
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
          {!isMainSettings && (
            <span style={{
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
              fontSize: '16px'
            }}>
              ▼
            </span>
          )}
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
    <>
      {/* Main Settings Parent Dropdown */}
      <DropdownGroup title="Settings" groupKey="mainSettings">
        
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

      </DropdownGroup>
    </>
  );
};

export default LauncherSettingContentLayer1;