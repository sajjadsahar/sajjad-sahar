import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.js';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', size = 'md' }) => {
  const { isDark, toggleTheme } = useTheme();

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const btnPaddings = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5'
  };

  return (
    <button
      onClick={toggleTheme}
      id="theme-toggle-button"
      className={`rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0f19] text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-300 hover:border-cyan-500/50 shadow-sm transition-all ${btnPaddings[size]} ${className}`}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className={`${iconSizes[size]} text-amber-400 hover:rotate-45 transition-transform`} />
      ) : (
        <Moon className={`${iconSizes[size]} text-slate-700 hover:-rotate-12 transition-transform`} />
      )}
    </button>
  );
};

export default ThemeToggle;
