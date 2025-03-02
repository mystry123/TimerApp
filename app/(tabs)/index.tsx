import React, { useState } from 'react';
import { View, ScrollView, Text, SafeAreaView, FlatList } from 'react-native';
import { useTimer } from '@/hooks/useTimer';
import { CategoryCard } from '@/components/timer/CategoryCard';
import { TimerForm } from '@/components/timer/TimerForm';
import Button from '@/components/common/Button';
import { Plus } from 'lucide-react-native';

const TimerScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const {
    startTimer,
    pauseTimer,
    resetTimer,
    addTimer,
    deleteTimer,
    expandedCategories,
    toggleCategoryExpansion,
    getGroupedTimers,
    startAllInCategory,
    pauseAllInCategory,
    resetAllInCategory,
  } = useTimer();

  const groupedTimers = getGroupedTimers();

  return (
    <SafeAreaView className="flex-1 bg-gray-100 dark:bg-black">
      <FlatList
        data={Object.entries(groupedTimers)}
        keyExtractor={([category]) => category}
        renderItem={({ item: [category, categoryTimers] }) => (
          <CategoryCard
            key={category}
            category={category}
            timers={categoryTimers}
            isExpanded={expandedCategories.includes(category)}
            onToggle={() => toggleCategoryExpansion(category)}
            onStartAll={startAllInCategory}
            onPauseAll={pauseAllInCategory}
            onResetAll={resetAllInCategory}
            onStartTimer={startTimer}
            onPauseTimer={pauseTimer}
            onResetTimer={resetTimer}
            onDeleteTimer={deleteTimer}
          />
        )}
        ListEmptyComponent={
          <View className="items-center justify-center py-10">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No timers yet
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Tap the + button to create your first timer
            </Text>
          </View>
        }
        contentContainerStyle={{ flexGrow: 1, padding: 4 }}
      />
      <Button
        variant="primary"
        size="icon"
        icon={<Plus size={24} color={'#fff'} />}
        onPress={() => setModalVisible(true)}
        className="absolute right-6 bottom-12"
      />

      <TimerForm
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={addTimer}
      />
    </SafeAreaView>
  );
};

export default TimerScreen;
