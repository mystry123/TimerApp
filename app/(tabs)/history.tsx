import React, { useEffect } from 'react';
import { View, Text, FlatList, SafeAreaView } from 'react-native';
import { Clock } from 'lucide-react-native';
import { useIsFocused } from '@react-navigation/native';
import { useTimerHistory } from '@/hooks/useTimerHistory';
import { formatDate, formatDuration } from '@/utils/format';

interface HistoryItem {
  id: string;
  name: string;
  category: string;
  duration: number;
  completedAt: string;
}

const HistoryScreen = () => {
  const { history, loadHistory } = useTimerHistory();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      loadHistory();
    }
  }, [isFocused, history]);

  const renderHistoryItem = ({ item }: { item: HistoryItem }) => (
    <View className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-3 m-2 shadow-sm">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-base font-semibold text-gray-900 dark:text-white">
          {item.name}
        </Text>
        <View className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
          <Text className="text-xs text-blue-600 dark:text-blue-300 font-medium">
            {item.category}
          </Text>
        </View>
      </View>
      <View className="mt-2">
        <View className="flex-row items-center mb-1">
          <Clock size={16} className="text-gray-400 dark:text-gray-500" />
          <Text className="text-sm text-gray-500 dark:text-gray-400 ml-1.5">
            Duration: {formatDuration(item.duration)}
          </Text>
        </View>
        <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Completed: {formatDate(item.completedAt)}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100 dark:bg-black ">
      {history.length > 0 ? (
        <FlatList
          data={history}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => `${item.id}-${item.completedAt}`}
          className="flex-1 p-4"
        />
      ) : (
        <View className="flex-1 justify-center items-center p-10">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No timer history yet
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Completed timers will appear here
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default HistoryScreen;
