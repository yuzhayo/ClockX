import React from 'react';
import { SaveIcon, XIcon } from '../assets/icons';
import { SettingScreenProps } from './LauncherIndex';

const SettingScreen: React.FC<SettingScreenProps> = ({ 
  isVisible, 
  onClose, 
  onSave 
}) => {

  if (!isVisible) return null;

  return (
    <div
      className="setting-screen"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '25%', // Changed to 25% width from left boundary
        height: '100vh',
        backgroundColor: 'rgba(26, 26, 26, 0.95)',
        backdropFilter: 'blur(10px)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)'
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
        {/* Close Button - Top Right */}
        <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <h2 style={{
            color: 'white',
            fontSize: '18px',
            fontWeight: '600',
            margin: 0
          }}>
            Settings
          </h2>
        </div>

        <button
          onClick={onClose}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            color: 'white',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
          }}
        >
          <XIcon size={16} />
        </button>
      </div>

      {/* Settings Content */}
      <div style={{ 
        flex: 1, 
        padding: '20px',
        overflowY: 'auto'
      }}>
        {/* General Settings Section */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{
            color: '#e5e5e5',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '16px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            General
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Theme Setting */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <span style={{ color: '#d1d5db', fontSize: '14px' }}>Dark Mode</span>
              <div style={{
                width: '44px',
                height: '24px',
                backgroundColor: '#2563eb',
                borderRadius: '12px',
                position: 'relative',
                cursor: 'pointer'
              }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  transition: 'transform 0.2s'
                }}></div>
              </div>
            </div>

            {/* Auto-save Setting */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <span style={{ color: '#d1d5db', fontSize: '14px' }}>Auto-save</span>
              <div style={{
                width: '44px',
                height: '24px',
                backgroundColor: '#374151',
                borderRadius: '12px',
                position: 'relative',
                cursor: 'pointer'
              }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: '2px',
                  left: '2px',
                  transition: 'transform 0.2s'
                }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Display Settings Section */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{
            color: '#e5e5e5',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '16px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Display
          </h3>
          
          <div style={{
            padding: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <label style={{ 
              color: '#d1d5db', 
              fontSize: '14px',
              display: 'block',
              marginBottom: '8px'
            }}>
              Screen Resolution
            </label>
            <select style={{
              width: '100%',
              padding: '8px 12px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              color: 'white',
              fontSize: '14px'
            }}>
              <option value="auto">Auto</option>
              <option value="1920x1080">1920x1080</option>
              <option value="1366x768">1366x768</option>
              <option value="1280x720">1280x720</option>
            </select>
          </div>
        </div>

        {/* Advanced Settings Section */}
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
            padding: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            marginBottom: '16px'
          }}>
            <button
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                color: '#d1d5db',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Clear Cache
            </button>
          </div>

          {/* Save Button */}
          <button
            onClick={onSave}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px 16px',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
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
            <SaveIcon size={16} />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingScreen;