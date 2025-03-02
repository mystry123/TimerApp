import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
  Platform,
  SafeAreaView,
} from 'react-native';
import { Moon, Sun, Trash2, Info, Vibrate } from 'lucide-react-native';
import { useSettings } from '@/contexts/SettingContext';

const SettingsScreen = () => {
  const { settings, toggleSetting, resetSettings } = useSettings();
  console.log('rendersss')

  const handleToggleSetting = async (setting: keyof typeof settings) => {
    try {
      await  toggleSetting(setting);
    } catch (error) {
      Alert.alert('Error', 'Failed to update setting');
    }
  };

  const clearAllData = () => {
    Alert.alert(
      'Reset All Settings',
      'Are you sure you want to reset all settings to default? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await resetSettings();
              Alert.alert(
                'Success',
                'All settings have been reset to default.'
              );
            } catch (error) {
              Alert.alert(
                'Error',
                'Failed to reset settings. Please try again.'
              );
            }
          },
        },
      ]
    );
  };

  const showAbout = () => {
    Alert.alert(
      'About Timer App',
      'Timer App v1.0.0\n\nA customizable timer application that allows you to create, manage, and track multiple timers across different categories.\n\n© 2024 Timer App',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100 dark:bg-black">
      <ScrollView className="flex-1 p-4">
        <View className="mb-6 mx-2 mt-4">
          {/* Appearance Section */}
          <View className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm mb-6">
            <Text className="text-base font-semibold text-gray-900 dark:text-white p-4 border-b border-gray-200 dark:border-gray-700">
              Appearance
            </Text>
            <View className="flex-row justify-between items-center p-4">
              <View className="flex-row items-center">
                {settings.darkMode ? (
                  <Moon
                    size={20}
                    className="text-gray-500 dark:text-gray-400 mr-3"
                  />
                ) : (
                  <Sun size={20} className="text-orange-500 mr-3" />
                )}
                <Text className="text-base text-gray-900 dark:text-white">
                  Dark Mode
                </Text>
              </View>
              <Switch
                value={settings.darkMode}
                onValueChange={() => handleToggleSetting('darkMode')}
                trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
                thumbColor={
                  Platform.OS === 'ios'
                    ? '#FFFFFF'
                    : settings.darkMode
                    ? '#FFFFFF'
                    : '#F4F3F4'
                }
              />
            </View>
          </View>

          {/* Notifications Section */}
          <View className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm mb-6">
            <Text className="text-base font-semibold text-gray-900 dark:text-white p-4 border-b border-gray-200 dark:border-gray-700">
              Notifications
            </Text>
            <View className="flex-row justify-between items-center p-4">
              <View className="flex-row items-center">
                <Vibrate
                  size={20}
                  className="text-gray-500 dark:text-gray-400 mr-3"
                />
                <Text className="text-base text-gray-900 dark:text-white">
                  Vibration
                </Text>
              </View>
              <Switch
                value={settings.vibrationEnabled}
                onValueChange={() => handleToggleSetting('vibrationEnabled')}
                trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
                thumbColor={
                  Platform.OS === 'ios'
                    ? '#FFFFFF'
                    : settings.vibrationEnabled
                    ? '#FFFFFF'
                    : '#F4F3F4'
                }
              />
            </View>
          </View>

          {/* Data Management Section */}
          <View className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm mb-6">
            <Text className="text-base font-semibold text-gray-900 dark:text-white p-4 border-b border-gray-200 dark:border-gray-700">
              Data Management
            </Text>
            <TouchableOpacity
              className="flex-row items-center p-4"
              onPress={clearAllData}
            >
              <Trash2 size={20} className="text-red-500 mr-3" />
              <Text className="text-red-500 text-base">Reset All Settings</Text>
            </TouchableOpacity>
          </View>

          {/* About Section */}
          <View className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm">
            <Text className="text-base font-semibold text-gray-900 dark:text-white p-4 border-b border-gray-200 dark:border-gray-700">
              About
            </Text>
            <TouchableOpacity
              className="flex-row items-center p-4"
              onPress={showAbout}
            >
              <Info size={20} className="text-blue-500 mr-3" />
              <Text className="text-blue-500 text-base">About Timer App</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
