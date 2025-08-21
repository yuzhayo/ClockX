import { useCallback, useEffect, useRef, useState } from 'react';
import { GestureEvent, Coordinates } from '../components/types';

const TAP_THRESHOLD = 300; // ms
const TAP_DISTANCE_THRESHOLD = 10; // pixels
const TRIPLE_TAP_WINDOW = 800; // ms

export class GestureDetection {
  private tapCount: number = 0;
  private lastTapTime: number = 0;
  private tapTimer: NodeJS.Timeout | null = null;
  private onGesture?: (event: GestureEvent) => void;

  constructor(onGesture?: (event: GestureEvent) => void) {
    this.onGesture = onGesture;
  }

  handlePointerDown = (e: PointerEvent) => {
    const now = Date.now();
    const timeDiff = now - this.lastTapTime;

    if (timeDiff < TRIPLE_TAP_WINDOW) {
      this.tapCount++;
    } else {
      this.tapCount = 1;
    }

    this.lastTapTime = now;

    // Clear existing timer
    if (this.tapTimer) {
      clearTimeout(this.tapTimer);
    }

    // Set timer to detect final tap count
    this.tapTimer = setTimeout(() => {
      this.processTaps(e);
      this.tapCount = 0;
    }, TAP_THRESHOLD);
  };

  private processTaps = (e: PointerEvent) => {
    if (!this.onGesture) return;

    const position: Coordinates = {
      x: (e.clientX / window.innerWidth - 0.5) * 100,
      y: (e.clientY / window.innerHeight - 0.5) * 100
    };

    switch (this.tapCount) {
      case 1:
        this.onGesture({
          type: 'tap',
          position,
          timestamp: Date.now()
        });
        break;
      case 2:
        this.onGesture({
          type: 'double-tap',
          position,
          timestamp: Date.now()
        });
        break;
      case 3:
        this.onGesture({
          type: 'triple-tap',
          position,
          timestamp: Date.now()
        });
        break;
    }
  };

  destroy = () => {
    if (this.tapTimer) {
      clearTimeout(this.tapTimer);
    }
  };
}

export const useGestureDetection = (
  elementRef: React.RefObject<HTMLElement>,
  onGesture: (event: GestureEvent) => void
) => {
  const gestureDetectionRef = useRef<GestureDetection | null>(null);

  const initializeGestureDetection = useCallback(() => {
    if (gestureDetectionRef.current) {
      gestureDetectionRef.current.destroy();
    }
    gestureDetectionRef.current = new GestureDetection(onGesture);
  }, [onGesture]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    initializeGestureDetection();
    const gestureDetection = gestureDetectionRef.current;

    if (gestureDetection) {
      element.addEventListener('pointerdown', gestureDetection.handlePointerDown);
      
      return () => {
        element.removeEventListener('pointerdown', gestureDetection.handlePointerDown);
        gestureDetection.destroy();
      };
    }
  }, [elementRef, initializeGestureDetection]);

  return {
    gestureDetection: gestureDetectionRef.current
  };
};