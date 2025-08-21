import { Coordinates } from '../utils/customMapping';

export interface DrawPoint {
  x: number;
  y: number;
}

export interface DrawPath {
  points: DrawPoint[];
  color: string;
  width: number;
}

export interface GestureEvent {
  type: 'tap' | 'double-tap' | 'triple-tap' | 'drag' | 'pinch';
  position?: Coordinates;
  timestamp: number;
}

export interface ScreenDimensions {
  width: number;
  height: number;
}

export interface DrawableScreenProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: () => void;
}

export interface MainScreenProps {
  className?: string;
}