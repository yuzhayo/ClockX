import React from 'react';
import { useUpdateManager, UpdateStatus } from './LauncherUpdateManager';

interface LauncherSettingScreenButtonProps {
  hasChanges: boolean;
  saveStatus: 'idle' | 'saving' | 'success' | 'error';
  onSave: () => void;
  onClose: () => void;
  onMinimize?: () => void;
}

const LauncherSettingScreenButton: React.FC<LauncherSettingScreenButtonProps> = ({
  hasChanges,
  saveStatus,
  onSave,
  onClose,
  onMinimize
}) => {
  const { status: updateStatus, forceUpdate } = useUpdateManager();

  // Handle update button
  const handleUpdate = async () => {
    try {
      await forceUpdate();
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  return (
    <div
      className="launcher-settings-buttons"
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
  );
};

export default LauncherSettingScreenButton;