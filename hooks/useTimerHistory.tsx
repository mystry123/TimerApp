import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

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
      const  historyString = await AsyncStorage.getItem('timerHistory');
      const dataStr = JSON.stringify(historyString, null, 2);

      const fileName = `timer-history-${new Date().toISOString().split('T')[0]}.json`;
      const fileUri = FileSystem.documentDirectory + fileName;

      await FileSystem.writeAsStringAsync(fileUri, dataStr, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Share Timer History',
          UTI: 'public.json',
        });
      } else {
        Alert.alert('Sharing not available', 'Sharing is not available on this device.');
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
