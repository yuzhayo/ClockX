import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// Bridge: Import Launcher components from standalone Launcher module
import { LauncherMainScreen } from './Launcher/LauncherIndex';
import './index.css';

// Bridge App Component - Acts as bridge to Launcher system
const App: React.FC = () => {
  return (
    <div className="App">
      {/* Bridge: Route to Launcher system */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LauncherMainScreen />} />
          {/* All routing handled by Launcher system */}
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;