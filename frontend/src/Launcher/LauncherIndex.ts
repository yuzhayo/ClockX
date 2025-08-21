// Launcher Module - Self-contained launcher system
// All launcher-related functionality with consistent naming pattern

// ===== TYPE DEFINITIONS =====
export interface GestureEvent {
  type: 'tap' | 'double-tap' | 'triple-tap' | 'drag' | 'pinch';
  position?: import('./LauncherCustomMapping').Coordinates;
  timestamp: number;
}

export interface ScreenDimensions {
  width: number;
  height: number;
}

export interface SettingScreenProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: () => void;
}

// ===== COMPONENT EXPORTS =====
export { default as LauncherMainScreen } from './LauncherMainScreen';
export { default as LauncherSettingScreen } from './LauncherSettingScreen';
export { default as LauncherSettingScreenButton } from './LauncherSettingScreenButton';
export { default as LauncherSettingScreenContent } from './LauncherSettingScreenContent';
export {
  LauncherSettingScreenFloatingIcon,
  LauncherSettingScreenDragHandler,
  LauncherSettingScreenPinchZoom
} from './LauncherSettingScreenFloatingLogic';
export { CustomMapping } from './LauncherCustomMapping';
export { GestureDetection, useGestureDetection } from './LauncherGestureDetection';
export { SettingsManager, DEFAULT_SETTINGS } from './LauncherSettingsManager';
export { UpdateManager, useUpdateManager } from './LauncherUpdateManager';

// ===== TYPE RE-EXPORTS =====
export type {
  Coordinates,
  CSSPosition
} from './LauncherCustomMapping';

export type {
  AppSettings,
  AppVersion
} from './LauncherSettingsManager';

export type {
  UpdateStatus
} from './LauncherUpdateManager';