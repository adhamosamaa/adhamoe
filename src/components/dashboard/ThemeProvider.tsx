'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { THEME_COOKIE, writePreferenceCookie, type DashboardTheme } from './preferences';

interface ThemeContextValue {
  theme: DashboardTheme;
  setTheme: (theme: DashboardTheme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  initialTheme: DashboardTheme;
  children: ReactNode;
}

export function ThemeProvider({ initialTheme, children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<DashboardTheme>(initialTheme);

  const setTheme = useCallback((next: DashboardTheme) => {
    setThemeState(next);
    writePreferenceCookie(THEME_COOKIE, next);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, setTheme, toggleTheme]);

  return <ThemeContext value={value}>{children}</ThemeContext>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within <ThemeProvider>.');
  return context;
}
