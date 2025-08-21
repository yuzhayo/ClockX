import React from 'react';
import { Save, X } from 'lucide-react';
import { DrawableScreenProps } from './types';

const DrawableScreen: React.FC<DrawableScreenProps> = ({ 
  isVisible, 
  onClose, 
  onSave 
}) => {

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