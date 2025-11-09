import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import GAD7Quiz from './pages/GAD7Quiz';
import PHQ9Quiz from './pages/PHQ9Quiz';
import Summary from './pages/Summary';
import Results from './pages/Results';


import './App.css';
import './animations.css';
import './pages/Summary.css';

function App() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark' : '';
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="App">
      {/* Theme Toggle Button */}
      <button onClick={toggleTheme} className="theme-toggle-button">
        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
      </button>

      {/* Page Routes */}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/gad7" element={<GAD7Quiz />} />
        <Route path="/phq9" element={<PHQ9Quiz />} />
        <Route path="/results" element={<Results />} />
        <Route path="/summary" element={<Summary />} />
      </Routes>

    </div>
  );
}

export default App;
