import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SplashScreen } from 'expo-router';
import { useColorScheme } from 'nativewind';
import '../global.css';
import {  SettingsProvider } from '@/contexts/SettingContext';
import { View } from 'react-native';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  useEffect(() => {
    // Hide the splash screen once the app is ready
    SplashScreen.hideAsync();
    window.frameworkReady?.();
  }, []);

  return (
    <ErrorBoundary>
    <SettingsProvider>
      <View className="flex-1 bg-gray-100 dark:bg-black p-0">
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
        </Stack>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </View>
    </SettingsProvider>
    </ErrorBoundary>
  );
}