import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'high-contrast';
type Font = 'standard' | 'dyslexic';
type LineSpacing = 'standard' | 'increased';

interface AccessibilityContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  font: Font;
  setFont: (font: Font) => void;
  lineSpacing: LineSpacing;
  setLineSpacing: (spacing: LineSpacing) => void;
  reducedMotion: boolean;
  setReducedMotion: (reduced: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'light');
  const [font, setFont] = useState<Font>(() => (localStorage.getItem('font') as Font) || 'standard');
  const [lineSpacing, setLineSpacing] = useState<LineSpacing>(() => (localStorage.getItem('lineSpacing') as LineSpacing) || 'standard');
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => localStorage.getItem('reducedMotion') === 'true');

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Theme
    root.classList.remove('light', 'dark', 'high-contrast');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);

    // Font
    root.classList.remove('font-standard', 'font-dyslexic');
    root.classList.add(`font-${font}`);
    localStorage.setItem('font', font);

    // Line Spacing
    root.classList.remove('spacing-standard', 'spacing-increased');
    root.classList.add(`spacing-${lineSpacing}`);
    localStorage.setItem('lineSpacing', lineSpacing);

    // Reduced Motion
    if (reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
    localStorage.setItem('reducedMotion', reducedMotion.toString());
  }, [theme, font, lineSpacing, reducedMotion]);

  return (
    <AccessibilityContext.Provider value={{ 
      theme, setTheme, 
      font, setFont, 
      lineSpacing, setLineSpacing,
      reducedMotion, setReducedMotion 
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
