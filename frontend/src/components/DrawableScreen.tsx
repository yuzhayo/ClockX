import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Save, X } from 'lucide-react';
import { DrawableScreenProps, DrawPoint, DrawPath } from './types';

const DrawableScreen: React.FC<DrawableScreenProps> = ({ 
  isVisible, 
  onClose, 
  onSave 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<DrawPoint[]>([]);
  const [paths, setPaths] = useState<DrawPath[]>([]);
  const [currentColor] = useState('#ffffff');
  const [currentWidth] = useState(2);

  // Initialize canvas
  useEffect(() => {
    if (!isVisible || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Set canvas size to match display size
    canvas.width = rect.width;
    canvas.height = rect.height;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Set drawing properties
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalCompositeOperation = 'source-over';
      
      // Clear canvas with transparent background
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Redraw all existing paths
      redrawCanvas();
    }
  }, [isVisible, paths]);

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Redraw all paths
    paths.forEach(path => {
      if (path.points.length > 1) {
        ctx.strokeStyle = path.color;
        ctx.lineWidth = path.width;
        ctx.beginPath();
        
        const startPoint = path.points[0];
        ctx.moveTo(startPoint.x, startPoint.y);
        
        for (let i = 1; i < path.points.length; i++) {
          const point = path.points[i];
          ctx.lineTo(point.x, point.y);
        }
        
        ctx.stroke();
      }
    });
  }, [paths]);

  const getPointFromEvent = (e: React.PointerEvent): DrawPoint => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    
    const point = getPointFromEvent(e);
    setCurrentPath([point]);
    
    // Capture pointer for better tracking
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawing) return;
    
    e.preventDefault();
    const point = getPointFromEvent(e);
    
    setCurrentPath(prev => [...prev, point]);
    
    // Draw current stroke in real-time
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx || currentPath.length === 0) return;

    ctx.strokeStyle = currentColor;
    ctx.lineWidth = currentWidth;
    ctx.beginPath();
    
    const lastPoint = currentPath[currentPath.length - 1];
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDrawing) return;
    
    e.preventDefault();
    setIsDrawing(false);
    
    // Save the completed path
    if (currentPath.length > 1) {
      const newPath: DrawPath = {
        points: [...currentPath, getPointFromEvent(e)],
        color: currentColor,
        width: currentWidth
      };
      
      setPaths(prev => [...prev, newPath]);
    }
    
    setCurrentPath([]);
    
    // Release pointer capture
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.releasePointerCapture(e.pointerId);
    }
  };

  const clearCanvas = () => {
    setPaths([]);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className="drawable-screen"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Top Controls */}
      <div
        className="controls"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 20px',
          backgroundColor: 'rgba(26, 26, 26, 0.9)',
          backdropFilter: 'blur(10px)'
        }}
      >
        {/* Save Button - Top Left */}
        <button
          onClick={onSave}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#1d4ed8';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#2563eb';
          }}
        >
          <Save size={16} />
          Save
        </button>

        {/* Drawing Tools */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={clearCanvas}
            style={{
              padding: '8px 12px',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Clear
          </button>
          
          <div style={{ 
            color: '#888', 
            fontSize: '12px',
            fontFamily: 'monospace'
          }}>
            Drawing Mode Active
          </div>
        </div>

        {/* Close Button - Top Right */}
        <button
          onClick={onClose}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            color: 'white',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
          }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Drawing Canvas */}
      <div style={{ flex: 1, position: 'relative' }}>
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          style={{
            width: '100%',
            height: '100%',
            cursor: 'crosshair',
            touchAction: 'none' // Prevents scrolling on touch devices
          }}
        />
      </div>

      {/* Bottom Info */}
      <div
        style={{
          padding: '12px 20px',
          backgroundColor: 'rgba(26, 26, 26, 0.9)',
          color: '#666',
          fontSize: '12px',
          textAlign: 'center',
          fontFamily: 'monospace'
        }}
      >
        Use pointer/touch to draw • Triple tap outside to close • Changes are not automatically saved
      </div>
    </div>
  );
};

export default DrawableScreen;