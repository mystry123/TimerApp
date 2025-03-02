import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Vibration, Appearance } from 'react-native';
import setColorScheme = Appearance.setColorScheme;

interface Settings {
  darkMode: boolean;
  vibrationEnabled: boolean;
}

interface SettingsContextType {
  settings: Settings;
  vibrate: () => void;
  loadSettings: () => Promise<void>;
  toggleSetting: (setting: keyof Settings) => Promise<void>;
  resetSettings: () => Promise<void>;
}

const DEFAULT_SETTINGS: Settings = {
  darkMode: false,
  vibrationEnabled: true,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const loadSettings = async () => {
    try {
      const settingsString = await AsyncStorage.getItem('appSettings');
      if (settingsString) {
        const loadedSettings = JSON.parse(settingsString);
        setSettings(loadedSettings);
        setColorScheme(loadedSettings.darkMode ? 'dark' : 'light');
      } else {
        setSettings(DEFAULT_SETTINGS);
        setColorScheme(DEFAULT_SETTINGS.darkMode ? 'dark' : 'light');
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      setSettings(DEFAULT_SETTINGS);
    }
  };

  const toggleSetting = async (setting: keyof Settings) => {
    try {
      const newSettings = {
        ...settings,
        [setting]: !settings[setting],
      };
      setSettings(newSettings);
      if(setting === 'darkMode') {
        setColorScheme(newSettings.darkMode ? 'dark' : 'light');
      }
      await AsyncStorage.setItem('appSettings', JSON.stringify(newSettings));
    } catch (error) {
      console.error(`Failed to toggle ${setting}:`, error);
      throw new Error(`Failed to toggle ${setting}`);
    }
  };

  const resetSettings = async () => {
    try {
      setSettings(DEFAULT_SETTINGS);
      setColorScheme(DEFAULT_SETTINGS.darkMode ? 'dark' : 'light');
      await AsyncStorage.setItem('appSettings', JSON.stringify(DEFAULT_SETTINGS));
    } catch (error) {
      console.error('Failed to reset settings:', error);
      throw new Error('Failed to reset settings');
    }
  };

  const vibrate = () => {
    if (settings.vibrationEnabled) {
      Vibration.cancel();
      Vibration.vibrate(500);
    }
  };

  const contextValue = useMemo(() => ({
    settings,
    vibrate,
    loadSettings,
    toggleSetting,
    resetSettings,
  }), [settings]);

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}