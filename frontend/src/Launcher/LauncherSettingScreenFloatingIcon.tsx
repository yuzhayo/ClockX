import React from 'react';

interface LauncherSettingScreenFloatingIconProps {
  onClick: () => void;
  isVisible: boolean;
}

const LauncherSettingScreenFloatingIcon: React.FC<LauncherSettingScreenFloatingIconProps> = ({
  onClick,
  isVisible
}) => {
  if (!isVisible) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick();
  };

  return (
    <div
      onClick={handleClick}
      style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        width: '40px',
        height: '40px',
        backgroundColor: 'rgba(37, 99, 235, 0.9)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 1000,
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(10px)',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 1)';
        e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.9)';
        e.currentTarget.style.transform = 'scale(1)';
      }}
      title="Click to expand settings • Triple-tap to close"
    >
      {/* Settings Gear Icon */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="white"
        stroke="white"
        strokeWidth="1"
      >
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    </div>
  );
};

export default LauncherSettingScreenFloatingIcon;