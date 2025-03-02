import { SplashScreen, Tabs } from 'expo-router';
import {
  House,
  History,
  Settings,
  Download,
  Trash2,
} from 'lucide-react-native';
import { TouchableOpacity, View } from 'react-native';
import { useTimerHistory } from '@/hooks/useTimerHistory';
import { useColorScheme } from 'nativewind';
import { useSettings } from '@/contexts/SettingContext';
import { useEffect } from 'react';

export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  const { exportHistory, clearHistory, loadHistory } = useTimerHistory();
  const isDark = colorScheme === 'dark';


  const { loadSettings} = useSettings();


  useEffect(() => {
    loadSettings();
    loadHistory();
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: isDark ? '#000000' : '#F2F2F7',
        },
        headerStyle: {
          backgroundColor: isDark ? '#000000' : '#F2F2F7',
        },
        headerTitleStyle: {
          fontWeight: '600',
          color: isDark ? '#FFFFFF' : '#000000',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Timers',
          tabBarIcon: ({ color, size }) => <House size={size} color={color} />,
          headerTitle: 'My Timers',
        }}
      />
      <Tabs.Screen
        name="history"
        options={() => ({
          title: 'History',
          tabBarIcon: ({ color, size }) => (
            <History size={size} color={color} />
          ),
          headerTitle: 'History',
          headerRight: () => (
            <View className="flex-row mr-4">
              <TouchableOpacity className="p-2 mr-2" onPress={exportHistory}>
                <Download size={20} color={isDark ? '#60A5FA' : '#3B82F6'} />
              </TouchableOpacity>
              <TouchableOpacity className="p-2" onPress={clearHistory}>
                <Trash2 size={20} color={isDark ? '#F87171' : '#EF4444'} />
              </TouchableOpacity>
            </View>
          ),
        })}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Settings size={size} color={color} />
          ),
          headerTitle: 'Settings',
        }}
      />
    </Tabs>
  );
}
