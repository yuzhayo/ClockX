import React, { useRef, useCallback, useEffect } from 'react';

// =============================================================================
// INTERFACES AND TYPES
// =============================================================================

interface DragState {
  isDragging: boolean;
  startX: number;
  startY: number;
  initialX: number;
  initialY: number;
}

interface PinchZoomState {
  scale: number;
  lastDistance: number;
  isZooming: boolean;
}

// Floating Icon Props
interface LauncherSettingScreenFloatingIconProps {
  onClick: () => void;
  isVisible: boolean;
}

// Drag Handler Props
interface LauncherSettingScreenDragHandlerProps {
  children: React.ReactNode;
  position: { x: number; y: number };
  onPositionChange: (position: { x: number; y: number }) => void;
  dragHandle?: string;
  disabled?: boolean;
}

// Pinch Zoom Props
interface LauncherSettingScreenPinchZoomProps {
  children: React.ReactNode;
  zoomLevel: number;
  onZoomChange: (newZoom: number) => void;
  minZoom?: number;
  maxZoom?: number;
}

// =============================================================================
// LAUNCHER SETTING SCREEN FLOATING ICON
// =============================================================================

export const LauncherSettingScreenFloatingIcon: React.FC<LauncherSettingScreenFloatingIconProps> = ({
  onClick,
  isVisible
}) => {
  if (!isVisible) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('🔵 Floating icon clicked - calling onClick handler');
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

// =============================================================================
// LAUNCHER SETTING SCREEN DRAG HANDLER
// =============================================================================

export const LauncherSettingScreenDragHandler: React.FC<LauncherSettingScreenDragHandlerProps> = ({
  children,
  position,
  onPositionChange,
  dragHandle = '.drag-handle',
  disabled = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef<DragState>({
    isDragging: false,
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0
  });

  // Check if element is a valid drag handle
  const isDragHandle = useCallback((element: Element | null): boolean => {
    if (!element) return false;
    
    // Check if element or its parent has the drag handle class
    let currentElement: Element | null = element;
    while (currentElement && currentElement !== containerRef.current) {
      if (currentElement.matches && currentElement.matches(dragHandle)) {
        return true;
      }
      if (currentElement.classList && currentElement.classList.contains(dragHandle.replace('.', ''))) {
        return true;
      }
      currentElement = currentElement.parentElement;
    }
    return false;
  }, [dragHandle]);

  // Get constrained position within viewport
  const getConstrainedPosition = useCallback((x: number, y: number) => {
    if (!containerRef.current) return { x, y };
    
    const rect = containerRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Ensure panel stays within viewport bounds
    const constrainedX = Math.max(0, Math.min(x, viewportWidth - rect.width));
    const constrainedY = Math.max(0, Math.min(y, viewportHeight - rect.height));
    
    return { x: constrainedX, y: constrainedY };
  }, []);

  // Handle mouse down
  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (disabled || !isDragHandle(e.target as Element)) return;
    
    e.preventDefault();
    
    dragStateRef.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y
    };
    
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
  }, [disabled, isDragHandle, position]);

  // Handle mouse move
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragStateRef.current.isDragging) return;
    
    e.preventDefault();
    
    const { startX, startY, initialX, initialY } = dragStateRef.current;
    
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    
    const newPosition = getConstrainedPosition(
      initialX + deltaX,
      initialY + deltaY
    );
    
    onPositionChange(newPosition);
  }, [onPositionChange, getConstrainedPosition]);

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    dragStateRef.current.isDragging = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  // Handle touch events for mobile
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (disabled || e.touches.length !== 1 || !isDragHandle(e.target as Element)) return;
    
    const touch = e.touches[0];
    dragStateRef.current = {
      isDragging: true,
      startX: touch.clientX,
      startY: touch.clientY,
      initialX: position.x,
      initialY: position.y
    };
  }, [disabled, isDragHandle, position]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!dragStateRef.current.isDragging || e.touches.length !== 1) return;
    
    e.preventDefault();
    
    const touch = e.touches[0];
    const { startX, startY, initialX, initialY } = dragStateRef.current;
    
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;
    
    const newPosition = getConstrainedPosition(
      initialX + deltaX,
      initialY + deltaY
    );
    
    onPositionChange(newPosition);
  }, [onPositionChange, getConstrainedPosition]);

  const handleTouchEnd = useCallback(() => {
    dragStateRef.current.isDragging = false;
  }, []);

  // Set up event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Mouse events
    container.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Touch events
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleMouseDown, handleMouseMove, handleMouseUp, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: disabled ? 'default' : 'grab'
      }}
    >
      {children}
    </div>
  );
};

// =============================================================================
// LAUNCHER SETTING SCREEN PINCH ZOOM
// =============================================================================

export const LauncherSettingScreenPinchZoom: React.FC<LauncherSettingScreenPinchZoomProps> = ({
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

// =============================================================================
// DEFAULT EXPORTS
// =============================================================================

export default {
  FloatingIcon: LauncherSettingScreenFloatingIcon,
  DragHandler: LauncherSettingScreenDragHandler,
  PinchZoom: LauncherSettingScreenPinchZoom
};