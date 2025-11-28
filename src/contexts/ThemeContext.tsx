import { createContext, useContext, useEffect, ReactNode } from 'react';

const ThemeContext = createContext<undefined>(undefined);

export const useTheme = () => {
  // Theme is always dark, no-op hook for compatibility
  return undefined;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  // Always set dark mode
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.add('dark');
  }, []);

  return <ThemeContext.Provider value={undefined}>{children}</ThemeContext.Provider>;
};
