import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform, Share } from 'react-native';

interface HistoryItem {
  id: string;
  name: string;
  category: string;
  duration: number;
  completedAt: string;
}

export const useTimerHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const loadHistory = useCallback(async () => {
    try {
      const historyString = await AsyncStorage.getItem('timerHistory');
      if (historyString) {
        setHistory(JSON.parse(historyString));
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  }, []);

  const clearHistory = useCallback(async () => {
    console.log('clearHistory');
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all timer history? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.setItem('timerHistory', JSON.stringify([]));
              setHistory([]);
            } catch (error) {
              console.error('Failed to clear history:', error);
            }
          },
        },
      ]
    );
  }, []);

  const exportHistory = useCallback(async () => {
    try {
      console.log('Exporting history:', history);
      const dataStr = JSON.stringify(history, null, 2);
      console.log('Exporting history:', dataStr);

      if (Platform.OS === 'web') {
        const dataUri =
          'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = `timer-history-${
          new Date().toISOString().split('T')[0]
        }.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
      } else {
        await Share.share({
          title: 'Timer History',
          message: dataStr,
          url: Platform.OS === 'ios' ? undefined : dataStr, // Android requires message, iOS can use url
        });
      }
    } catch (error) {
      console.error('Failed to export history:', error);
      Alert.alert('Export Failed', 'Could not export timer history.');
    }
  }, [history]);

  return {
    history,
    loadHistory,
    clearHistory,
    exportHistory,
  };
};
