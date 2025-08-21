import React, { useEffect, useState, useRef } from 'react';
import { useGestureDetection, GestureEvent, LauncherSettingScreen } from './LauncherIndex';

interface LauncherMainScreenProps {
  className?: string;
  isSettingsVisible?: boolean;
}

interface ScreenDimensions {
  width: number;
  height: number;
}

const LauncherMainScreen: React.FC<LauncherMainScreenProps> = ({ className = '', isSettingsVisible = false }) => {
  const [screenDimensions, setScreenDimensions] = useState<ScreenDimensions>({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle gestures
  const handleGesture = (event: GestureEvent) => {
    console.log('Gesture detected:', event.type);
    
    if (event.type === 'triple-tap') {
      setIsSettingsVisible(true);
    }
  };

  // Initialize gesture detection
  useGestureDetection(containerRef, handleGesture);

  // Handle settings actions
  const handleCloseSettings = () => {
    setIsSettingsVisible(false);
  };

  const handleSaveSettings = () => {
    console.log('Settings saved!');
    // Add save logic here if needed
    setIsSettingsVisible(false);
  };

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
    <>
      <div 
        ref={containerRef}
        className={`launcher-main-screen ${className}`}
        style={{
          width: isSettingsVisible ? '75%' : '100%',
          marginLeft: isSettingsVisible ? '25%' : '0',
          height: '100%',
          minHeight: '100vh',
          backgroundColor: '#1a1a1a',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'width 0.3s ease, margin-left 0.3s ease'
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
          <div style={{ 
            fontSize: '12px', 
            marginTop: '16px', 
            opacity: 0.5,
            color: '#888'
          }}>
            Triple-tap to open settings
          </div>
        </div>
      </div>

      {/* Settings Screen Overlay */}
      <LauncherSettingScreen
        isVisible={isSettingsVisible}
        onClose={handleCloseSettings}
        onSave={handleSaveSettings}
      />
    </>
  );
};

export default LauncherMainScreen;
};

export default LauncherMainScreen;