import React from 'react';

interface LauncherSettingScreenFloatingIconProps {
  onClick: () => void;
  onClose: () => void;
  isVisible: boolean;
}

const LauncherSettingScreenFloatingIcon: React.FC<LauncherSettingScreenFloatingIconProps> = ({
  onClick,
  isVisible
}) => {
  if (!isVisible) return null;

  return (
    <div
      onClick={onClick}
      style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        width: '40px',
        height: '40px',
        backgroundColor: 'rgba(37, 99, 235, 0.8)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 1000,
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(10px)',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 1)';
        e.currentTarget.style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.8)';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {/* Settings Gear Icon */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1m3.5-6a3.5 3.5 0 1 0 7 0 3.5 3.5 0 1 0-7 0zM16.5 17a3.5 3.5 0 1 0 7 0 3.5 3.5 0 1 0-7 0z"/>
        <path d="M19.07 4.93l-1.41 1.41M6.34 17.66l-1.41 1.41M17.66 6.34l1.41-1.41M4.93 19.07l1.41-1.41"/>
      </svg>
    </div>
  );
};

export default LauncherSettingScreenFloatingIcon;