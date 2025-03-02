import React from 'react';
import { View } from 'react-native';
import { Timer } from '../../types/timer';
import { TimerCard } from './TimerCard';
import { CategoryHeader } from './CategoryHeader';

interface CategoryCardProps {
  category: string;
  timers: Timer[];
  isExpanded: boolean;
  onToggle: () => void;
  onStartAll: (category: string) => void;
  onPauseAll: (category: string) => void;
  onResetAll: (category: string) => void;
  onStartTimer: (id: string) => void;
  onPauseTimer: (id: string) => void;
  onResetTimer: (id: string) => void;
  onDeleteTimer: (id: string) => void;
}

export const CategoryCard = ({
  category,
  timers,
  isExpanded,
  onToggle,
  onStartAll,
  onPauseAll,
  onResetAll,
  onStartTimer,
  onPauseTimer,
  onResetTimer,
  onDeleteTimer,
}: CategoryCardProps) => {
  return (
    <View className="m-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
      <CategoryHeader
        category={category}
        isExpanded={isExpanded}
        onToggle={onToggle}
        onStartAll={() => onStartAll(category)}
        onPauseAll={() => onPauseAll(category)}
        onResetAll={() => onResetAll(category)}
      />

      {isExpanded && (
        <>
          {timers.map((timer) => (
            <TimerCard
              key={timer.id}
              timer={timer}
              onStart={() => onStartTimer(timer.id)}
              onPause={() => onPauseTimer(timer.id)}
              onReset={() => onResetTimer(timer.id)}
              onDelete={() => onDeleteTimer(timer.id)}
            />
          ))}
        </>
      )}
    </View>
  );
};
