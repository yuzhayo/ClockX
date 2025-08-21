import React, { useRef, useCallback, useEffect } from 'react';

interface DragState {
  isDragging: boolean;
  startX: number;
  startY: number;
  initialX: number;
  initialY: number;
}

interface LauncherSettingScreenDragHandlerProps {
  children: React.ReactNode;
  position: { x: number; y: number };
  onPositionChange: (position: { x: number; y: number }) => void;
  dragHandle?: string; // CSS class or data attribute for drag handle
  disabled?: boolean;
}

const LauncherSettingScreenDragHandler: React.FC<LauncherSettingScreenDragHandlerProps> = ({
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
    let currentElement = element;
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

export default LauncherSettingScreenDragHandler;