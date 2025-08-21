// Launcher Module - Self-contained launcher system with custom coordinate mapping and drawable interface
// All launcher-related functionality is isolated within this folder

export { default as MainScreen } from './MainScreen';
export { default as DrawableScreen } from './DrawableScreen';
export { CustomMapping } from './customMapping';
export { GestureDetection, useGestureDetection } from './gestureDetection';
export * from './types';

// Re-export for easier access
export type {
  GestureEvent,
  ScreenDimensions,
  DrawableScreenProps,
  MainScreenProps
} from './types';

export type {
  Coordinates,
  CSSPosition
} from './customMapping';