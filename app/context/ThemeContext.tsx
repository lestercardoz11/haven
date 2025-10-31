// src/context/ThemeContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';
import type { AppTheme, ThemeMode } from '../types/common.types';
import { COLORS } from '../utils/constants';

interface ThemeContextType {
  theme: AppTheme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const lightTheme: AppTheme = {
  mode: 'light',
  colors: {
    primary: COLORS.primary,
    secondary: COLORS.secondary,
    background: COLORS.backgroundLight,
    text: COLORS.textLight,
    textMuted: COLORS.textMutedLight,
    border: COLORS.borderLight,
    error: COLORS.error,
    success: COLORS.success,
    warning: COLORS.warning,
  },
};

const darkTheme: AppTheme = {
  mode: 'dark',
  colors: {
    primary: COLORS.primary,
    secondary: COLORS.secondary,
    background: COLORS.backgroundDark,
    text: COLORS.textDark,
    textMuted: COLORS.textMutedDark,
    border: COLORS.borderDark,
    error: COLORS.error,
    success: COLORS.success,
    warning: COLORS.warning,
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('light');

  useEffect(() => {
    loadThemePreference();
  }, [loadThemePreference]);

  const loadThemePreference = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem('theme_mode');
      if (saved) {
        setThemeModeState(saved as ThemeMode);
      } else if (systemColorScheme) {
        setThemeModeState(systemColorScheme);
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  }, [systemColorScheme]);

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem('theme_mode', mode);
      setThemeModeState(mode);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const toggleTheme = () => {
    const newMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newMode);
  };

  const theme = themeMode === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeMode,
        setThemeMode,
        toggleTheme,
      }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
