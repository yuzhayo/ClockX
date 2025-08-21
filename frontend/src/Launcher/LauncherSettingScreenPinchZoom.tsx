import React, { useEffect, useRef, useCallback } from 'react';

interface PinchZoomState {
  scale: number;
  lastDistance: number;
  isZooming: boolean;
}

interface LauncherSettingScreenPinchZoomProps {
  children: React.ReactNode;
  zoomLevel: number;
  onZoomChange: (newZoom: number) => void;
  minZoom?: number;
  maxZoom?: number;
}

const LauncherSettingScreenPinchZoom: React.FC<LauncherSettingScreenPinchZoomProps> = ({
  children,
  zoomLevel,
  onZoomChange,
  minZoom = 0.5,
  maxZoom = 2.0
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinchStateRef = useRef<PinchZoomState>({
    scale: zoomLevel,
    lastDistance: 0,
    isZooming: false
  });

  // Calculate distance between two touch points
  const getDistance = useCallback((touches: TouchList) => {
    if (touches.length < 2) return 0;
    
    const touch1 = touches[0];
    const touch2 = touches[1];
    
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  // Handle touch start
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const distance = getDistance(e.touches);
      pinchStateRef.current = {
        scale: zoomLevel,
        lastDistance: distance,
        isZooming: true
      };
    }
  }, [zoomLevel, getDistance]);

  // Handle touch move (pinch)
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2 && pinchStateRef.current.isZooming) {
      e.preventDefault();
      
      const distance = getDistance(e.touches);
      const { lastDistance, scale } = pinchStateRef.current;
      
      if (lastDistance > 0) {
        const delta = distance / lastDistance;
        const newScale = Math.min(Math.max(scale * delta, minZoom), maxZoom);
        
        onZoomChange(newScale);
        
        pinchStateRef.current = {
          ...pinchStateRef.current,
          scale: newScale,
          lastDistance: distance
        };
      }
    }
  }, [getDistance, onZoomChange, minZoom, maxZoom]);

  // Handle touch end
  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (e.touches.length < 2) {
      pinchStateRef.current.isZooming = false;
    }
  }, []);

  // Handle wheel zoom (for desktop)
  const handleWheel = useCallback((e: WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.min(Math.max(zoomLevel * delta, minZoom), maxZoom);
      
      onZoomChange(newZoom);
    }
  }, [zoomLevel, onZoomChange, minZoom, maxZoom]);

  // Set up event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Touch events for mobile pinch
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: false });
    
    // Wheel event for desktop zoom
    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('wheel', handleWheel);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, handleWheel]);

  return (
    <div
      ref={containerRef}
      style={{
        transform: `scale(${zoomLevel})`,
        transformOrigin: 'top left',
        transition: pinchStateRef.current.isZooming ? 'none' : 'transform 0.2s ease',
        touchAction: 'none'
      }}
    >
      {children}
    </div>
  );
};

export default LauncherSettingScreenPinchZoom;