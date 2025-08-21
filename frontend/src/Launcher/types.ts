export interface GestureEvent {
  type: 'tap' | 'double-tap' | 'triple-tap' | 'drag' | 'pinch';
  position?: import('./customMapping').Coordinates;
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