import React, { useRef, useState, useEffect } from 'react';
import { CustomMapping } from '../utils/customMapping';
import { useGestureDetection } from '../utils/gestureDetection';
import { GestureEvent, MainScreenProps, ScreenDimensions } from './types';
import DrawableScreen from './DrawableScreen';

const MainScreen: React.FC<MainScreenProps> = ({ className = '' }) => {
  const screenRef = useRef<HTMLDivElement>(null);
  const [isDrawableVisible, setIsDrawableVisible] = useState(false);
  const [screenDimensions, setScreenDimensions] = useState<ScreenDimensions>({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // Handle window resize
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

  // Handle gestures
  const handleGesture = (event: GestureEvent) => {
    console.log('Gesture detected:', event);
    
    if (event.type === 'triple-tap') {
      setIsDrawableVisible(prev => !prev);
    }
  };

  useGestureDetection(screenRef, handleGesture);

  // Calculate center dot position
  const centerDotPosition = CustomMapping.getCenterDotPosition();
  
  // Determine if device is in portrait mode
  const isPortrait = screenDimensions.height > screenDimensions.width;
  
  // Calculate main container dimensions for 1:1 aspect ratio
  const containerSize = isPortrait 
    ? `${screenDimensions.width}px` 
    : `${screenDimensions.height}px`;

  const handleSave = () => {
    console.log('Save button clicked - ready for future implementation');
    // This will be wired later by user
  };

  const handleClose = () => {
    setIsDrawableVisible(false);
  };

  return (
    <div 
      ref={screenRef}
      className={`main-screen ${className}`}
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#1a1a1a',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'crosshair'
      }}
    >
      {/* Main content container with 1:1 aspect ratio */}
      <div
        className="content-container"
        style={{
          width: containerSize,
          height: containerSize,
          position: 'relative',
          border: '1px solid #333',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%)'
        }}
      >
        {/* Center Dot Mark - Origin (0,0) */}
        <div
          className="center-dot"
          style={{
            position: 'absolute',
            left: centerDotPosition.left,
            top: centerDotPosition.top,
            transform: 'translate(-50%, -50%)',
            width: '0.5%',
            height: '0.5%',
            minWidth: '4px',
            minHeight: '4px',
            backgroundColor: '#ffffff',
            borderRadius: '50%',
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.6)',
            zIndex: 10
          }}
        />

        {/* Coordinate Grid Lines (Optional - for debugging) */}
        <div
          className="grid-lines"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            opacity: 0.1
          }}
        >
          {/* Vertical center line */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '0',
              width: '1px',
              height: '100%',
              backgroundColor: '#ffffff',
              transform: 'translateX(-50%)'
            }}
          />
          {/* Horizontal center line */}
          <div
            style={{
              position: 'absolute',
              left: '0',
              top: '50%',
              width: '100%',
              height: '1px',
              backgroundColor: '#ffffff',
              transform: 'translateY(-50%)'
            }}
          />
        </div>

        {/* Information overlay */}
        <div
          className="info-overlay"
          style={{
            position: 'absolute',
            bottom: '5%',
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#888',
            fontSize: '14px',
            textAlign: 'center',
            pointerEvents: 'none',
            fontFamily: 'monospace'
          }}
        >
          <div>Custom Coordinate System Active</div>
          <div style={{ fontSize: '12px', marginTop: '4px' }}>
            Triple tap to access drawing mode
          </div>
          <div style={{ fontSize: '10px', marginTop: '4px', opacity: 0.6 }}>
            Origin (0,0) at center dot | {isPortrait ? 'Portrait' : 'Landscape'} Mode
          </div>
        </div>
      </div>

      {/* Drawable Screen Overlay */}
      <DrawableScreen
        isVisible={isDrawableVisible}
        onClose={handleClose}
        onSave={handleSave}
      />
    </div>
  );
};

export default MainScreen;