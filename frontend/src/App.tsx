import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LauncherMainScreen } from './Launcher/LauncherIndex';
import './index.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LauncherMainScreen />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;