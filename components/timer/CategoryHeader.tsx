import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  RotateCcw,
} from 'lucide-react-native';
import Button from '../common/Button';

interface CategoryHeaderProps {
  category: string;
  isExpanded: boolean;
  onToggle: () => void;
  onStartAll: () => void;
  onPauseAll: () => void;
  onResetAll: () => void;
}

export const CategoryHeader = ({
  category,
  isExpanded,
  onToggle,
  onStartAll,
  onPauseAll,
  onResetAll,
}: CategoryHeaderProps) => {
  return (
    <>
      <TouchableOpacity
        className="flex-row justify-between items-center p-4"
        onPress={onToggle}
      >
        <Text className="text-lg font-semibold text-gray-900 dark:text-white">
          {category}
        </Text>
        {isExpanded ? (
          <ChevronUp/>
        ) : (
          <ChevronDown size={24} className="text-blue-500 dark:text-blue-400" />
        )}
      </TouchableOpacity>

      {isExpanded && (
        <View className="flex-row justify-between p-2 bg-gray-50 dark:bg-gray-900">
          <Button
            variant="primary"
            size="large"
            icon={<Play size={16} color="#fff" />}
            label="Start All"
            onPress={onStartAll}
            className="flex-1 mx-1"
          />
          <Button
            variant="warning"
            size="large"
            icon={<Pause size={16} color="#fff" />}
            label="Pause All"
            onPress={onPauseAll}
            className="flex-1 mx-1"
          />
          <Button
            variant="danger"
            size="large"
            icon={<RotateCcw size={16} color="#fff" />}
            label="Reset All"
            onPress={onResetAll}
            className="flex-1 mx-1"
          />
        </View>
      )}
    </>
  );
};
