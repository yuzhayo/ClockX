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
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          minHeight: '100vh',
          backgroundColor: '#1a1a1a',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1
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
          {isSettingsVisible ? 'Launcher with Settings' : 'Clean Launcher Screen'}
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
            {isSettingsVisible ? 'Settings panel active • Click X to close' : 'Triple-tap to open settings'}
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