// Plain .ts file — no JSX — so Fast Refresh never flags this.
import { createContext } from 'react';

export interface ThemeState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeState | null>(null);
