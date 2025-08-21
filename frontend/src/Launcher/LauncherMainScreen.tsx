import React, { useEffect, useState, useRef } from 'react';
import { useGestureDetection, GestureEvent, LauncherSettingScreen } from './LauncherIndex';

interface LauncherMainScreenProps {
  className?: string;
}

interface ScreenDimensions {
  width: number;
  height: number;
}

const LauncherMainScreen: React.FC<LauncherMainScreenProps> = ({ className = '' }) => {
  const [screenDimensions, setScreenDimensions] = useState<ScreenDimensions>({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setScreenDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div 
      className={`launcher-main-screen ${className}`}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '100vh',
        backgroundColor: '#1a1a1a',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Clean empty screen - scalable content area */}
      <div
        style={{
          color: '#666',
          fontSize: '18px',
          textAlign: 'center',
          fontFamily: 'monospace'
        }}
      >
        Clean Launcher Screen
        <div style={{ 
          fontSize: '14px', 
          marginTop: '8px', 
          opacity: 0.7 
        }}>
          {screenDimensions.width}x{screenDimensions.height}
        </div>
      </div>
    </div>
  );
};

export default LauncherMainScreen;