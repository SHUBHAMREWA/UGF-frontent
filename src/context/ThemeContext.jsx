import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Get initial theme from localStorage or default to 'light'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('site-theme') || 'light';
  });

  useEffect(() => {
    // Apply the theme to the <html> element
    const root = document.documentElement;
    
    // Remove old logic if any (class based)
    root.classList.remove('light', 'dark');
    
    // Set data-theme attribute which our CSS will use
    root.setAttribute('data-theme', theme);
    
    // Save to localStorage
    localStorage.setItem('site-theme', theme);
    
  }, [theme]);

  const value = {
    theme,
    setTheme,
    themes: [
      { id: 'light', name: 'Light', color: '#ffffff', textColor: '#000000' },
      { id: 'dark', name: 'Dark', color: '#1a1a1a', textColor: '#ffffff' },
      { id: 'green', name: 'Nature', color: '#f0fdf4', textColor: '#14532d' },
      { id: 'orange', name: 'Sunset', color: '#fff7ed', textColor: '#431407' }
    ]
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};