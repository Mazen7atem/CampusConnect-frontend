import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
type Direction = 'ltr' | 'rtl';
type Language = 'en' | 'ar';

interface ThemeContextType {
  theme: Theme;
  direction: Direction;
  language: Language;
  toggleTheme: () => void;
  toggleDirection: () => void;
  setLanguage: (lang: Language) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('theme');
    return (stored as Theme) || 'light';
  });
  
  const [direction, setDirection] = useState<Direction>(() => {
    const stored = localStorage.getItem('direction');
    return (stored as Direction) || 'ltr';
  });

  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem('language');
    return (stored as Language) || 'en';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.dir = direction;
    localStorage.setItem('direction', direction);
  }, [direction]);

  useEffect(() => {
    localStorage.setItem('language', language);
    setDirection(language === 'ar' ? 'rtl' : 'ltr');
  }, [language]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  const toggleDirection = () => setDirection(prev => prev === 'ltr' ? 'rtl' : 'ltr');

  return (
    <ThemeContext.Provider value={{ theme, direction, language, toggleTheme, toggleDirection, setLanguage }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
