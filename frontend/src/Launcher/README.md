# Launcher Module - Self-Contained Launcher System

## 📁 Current Structure

```
/app/frontend/src/Launcher/
├── README.md               # This documentation
├── index.ts                # Module exports (entry point)
├── types.ts                # TypeScript interfaces and types
├── customMapping.tsx       # Custom coordinate system logic
├── gestureDetection.tsx    # Triple-tap gesture handling
├── MainScreen.tsx          # Main screen with center dot
└── DrawableScreen.tsx      # Drawing canvas overlay
```

## 🎯 Self-Contained Architecture

### ✅ What's Inside Launcher/
All launcher functionality is completely isolated within this folder:

- **Custom Coordinate System**: Center-based mapping (0,0 = screen center)
- **Gesture Detection**: Triple-tap activation system
- **Main Screen**: Dark theme with 1:1 aspect ratio container
- **Drawing Canvas**: Full-screen overlay with drawing tools
- **TypeScript Interfaces**: Complete type definitions
- **Module Exports**: Clean API for external use

### ✅ No External Dependencies
The Launcher module is fully self-sufficient:

- All imports are relative within the Launcher folder
- No dependencies on `/utils/` or `/components/` (those were removed)
- No hard-coded external paths
- All necessary code is duplicated/included within this folder

## 🔌 Integration with Main App

### App.tsx Integration
```typescript
import MainScreen from './Launcher/MainScreen';

const App: React.FC = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainScreen />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};
```

### Module Exports (index.ts)
```typescript
// Easy imports from outside
export { default as MainScreen } from './MainScreen';
export { default as DrawableScreen } from './DrawableScreen';
export { CustomMapping } from './customMapping';
export { GestureDetection, useGestureDetection } from './gestureDetection';
export * from './types';
```

## 🛠️ Key Features

### 1. Custom Coordinate System
- **Origin**: Center dot at screen center (0,0)
- **Mapping**: +X=right, -X=left, +Y=down, -Y=up
- **Units**: All percentages, no fixed pixels
- **Responsive**: Adapts to portrait/landscape modes

### 2. Gesture System
- **Activation**: Triple-tap anywhere on screen
- **Detection**: 800ms window for gesture recognition
- **Toggle**: Shows/hides drawable interface

### 3. Drawing Interface
- **Canvas**: Full-screen overlay with real-time drawing
- **Controls**: Save (top-left), Close (top-right), Clear
- **Touch Support**: Works on desktop and mobile devices

### 4. Responsive Design
- **Aspect Ratio**: Always maintains 1:1 content ratio
- **Orientation**: Fills height (portrait) or width (landscape)
- **Scaling**: Everything percentage-based for scalability

## 🔧 Usage Examples

### Basic Usage
```typescript
import { MainScreen } from './Launcher';

// Use directly
<MainScreen />

// With props
<MainScreen className="custom-class" />
```

### Advanced Usage
```typescript
import { 
  CustomMapping, 
  useGestureDetection, 
  DrawableScreen 
} from './Launcher';

// Position element using custom coordinates
const coords = { x: -20, y: 50 }; // 20% left, 50% down from center
const cssPos = CustomMapping.toCSS(coords);

// Use gesture detection
const elementRef = useRef<HTMLDivElement>(null);
useGestureDetection(elementRef, (gesture) => {
  console.log('Gesture:', gesture);
});

// Controlled drawable screen
<DrawableScreen 
  isVisible={isVisible}
  onClose={() => setIsVisible(false)}
  onSave={() => console.log('Save triggered')}
/>
```

## 🚀 Benefits of This Structure

### 1. **Complete Isolation**
- No broken imports if external folders are deleted
- Self-contained with all necessary dependencies
- Easy to move or duplicate to other projects

### 2. **Clean Integration**
- Simple import from main app: `import MainScreen from './Launcher/MainScreen'`
- Optional modular imports via `index.ts`
- No pollution of global app structure

### 3. **Maintainability**
- All launcher logic in one place
- Clear separation from other app features
- Easy to debug and modify

### 4. **Extensibility**
- Easy to add new launcher features
- Coordinate system ready for element positioning
- Gesture system extensible for more gestures

## 🔍 File Descriptions

### `MainScreen.tsx`
- Primary launcher interface
- Dark grey background with center dot
- 1:1 aspect ratio container with grid lines
- Gesture detection integration
- Manages drawable screen visibility

### `DrawableScreen.tsx`
- Full-screen canvas overlay
- Real-time drawing with pointer events
- Save/Close/Clear controls
- Path storage and canvas management

### `customMapping.tsx`
- Custom coordinate system implementation
- Conversion between custom coords and CSS
- Responsive positioning utilities
- Distance calculation helpers

### `gestureDetection.tsx`
- Triple-tap gesture recognition
- Configurable timing windows
- Pointer event handling
- React hook for easy integration

### `types.ts`
- Complete TypeScript interfaces
- All necessary type definitions
- Self-contained, no external type imports

### `index.ts`
- Module entry point
- Clean exports for external use
- Type re-exports for convenience

## ✅ Verified Working Features

1. ✅ Self-contained import structure
2. ✅ Custom coordinate system with center dot
3. ✅ Triple-tap gesture activation
4. ✅ Drawing canvas with full functionality
5. ✅ Responsive 1:1 aspect ratio
6. ✅ Save/Close controls
7. ✅ TypeScript throughout
8. ✅ No external dependencies
9. ✅ Clean module exports
10. ✅ Easy integration with main app

The Launcher module is now completely self-sufficient and can function independently even if other app folders are modified or deleted.