# Clean App Architecture Guidelines

## Architecture Principles

### 1. Hub Pattern
- **App.tsx** acts as a central hub only - no business logic
- All functionality is modular and isolated in separate files
- Clean separation of concerns

### 2. File Structure
```
src/
├── App.tsx                 # Hub only - routes and providers
├── utils/
│   ├── customMapping.tsx   # Custom coordinate system logic
│   └── gestureDetection.tsx # Gesture handling logic
├── components/
│   ├── MainScreen.tsx      # Main screen with center dot
│   ├── DrawableScreen.tsx  # Drawing canvas overlay
│   └── types.ts           # TypeScript interfaces
└── styles/
    └── global.css         # Global styles
```

### 3. Custom Coordinate System
- **Center Dot Mark**: 0.5% size dot at screen center (0,0 origin)
- **Coordinate Mapping**: 
  - +X = right, -X = left from center
  - +Y = down, -Y = up from center
  - All values in percentages
- **Example**: x=-20, y=50 = 20% left, 50% down from center

### 4. Gesture System
- **Triple Tap**: Shows/hides drawable screen
- **Drawing**: Canvas drawing functionality
- **Responsive**: 1:1 aspect ratio with device orientation support

### 5. Development Rules
1. Never put logic in App.tsx
2. Create new files for new features
3. Use TypeScript throughout
4. No pixel values - percentages only
5. Maintain clean modular structure

### 6. Color Scheme
- Background: Dark grey (#1a1a1a)
- Center dot: White with subtle glow
- UI elements: Monochromatic with accent colors

## Future AI Agent Instructions
- Follow the hub pattern strictly
- Create new files for new logic
- Maintain the custom coordinate system
- Keep App.tsx minimal
- Use the established file structure