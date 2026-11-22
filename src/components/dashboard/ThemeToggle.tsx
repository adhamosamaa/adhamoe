'use client';

import { Moon, Sun } from 'lucide-react';
import { cn } from '@/utils/cn';
import { iconButtonClass } from './preferences';
import { useTheme } from './ThemeProvider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const label = `Switch to ${isDark ? 'light' : 'dark'} mode`;

  return (
    <button
      type="button"
      id="dashboard-theme-toggle"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={cn(iconButtonClass, 'overflow-hidden')}
    >
      <Sun
        strokeWidth={1.75}
        className={cn(
          'absolute size-[18px] transition-all duration-500 ease-out-expo',
          isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100',
        )}
      />
      <Moon
        strokeWidth={1.75}
        className={cn(
          'absolute size-[18px] transition-all duration-500 ease-out-expo',
          isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0',
        )}
      />
    </button>
  );
}
