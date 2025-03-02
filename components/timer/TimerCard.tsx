import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Play, Pause, RotateCcw, Check, Trash2 } from 'lucide-react-native';
import { Timer } from '../../types/timer';
import { formatTime } from '../../utils/format';

interface TimerCardProps {
  timer: Timer;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onDelete: () => void;
}

export const TimerCard = ({
  timer,
  onStart,
  onPause,
  onReset,
  onDelete,
}: TimerCardProps) => {
  return (
    <View className="p-4 border-t border-gray-100 dark:border-gray-700">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-base font-semibold text-gray-900 dark:text-white">
          {timer.name}
        </Text>
        <Text
          className={`px-2 py-1 rounded text-sm font-medium ${
            timer.status === 'running'
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
              : timer.status === 'paused'
              ? 'bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300'
              : timer.status === 'completed'
              ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300'
              : 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300'
          }`}
        >
          {timer.status.charAt(0).toUpperCase() + timer.status.slice(1)}
        </Text>
      </View>

      <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {formatTime(timer.remainingTime)}
      </Text>

      <View className="h-2 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden mb-4">
        <View
          className={`h-full rounded ${
            timer.status === 'completed'
              ? 'bg-green-500'
              : timer.status === 'running'
              ? 'bg-blue-500'
              : 'bg-gray-400'
          }`}
          style={{
            width: `${Math.max(
              (timer.remainingTime / timer.duration) * 100,
              0
            )}%`,
          }}
        />
      </View>

      <View className="flex-row">
        {timer.status !== 'completed' && (
          <>
            {timer.status !== 'running' ? (
              <TouchableOpacity
                className="w-10 h-10 rounded-full bg-blue-500 justify-center items-center mr-3"
                onPress={onStart}
              >
                <Play size={20} color="#fff" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                className="w-10 h-10 rounded-full bg-orange-500 justify-center items-center mr-3"
                onPress={onPause}
              >
                <Pause size={20} color="#fff" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              className="w-10 h-10 rounded-full bg-orange-500 justify-center items-center mr-3"
              onPress={onReset}
            >
              <RotateCcw size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              className="w-10 h-10 rounded-full bg-red-600 justify-center items-center"
              onPress={onDelete}
            >
              <Trash2 size={20} color="#fff" />
            </TouchableOpacity>
          </>
        )}
        {timer.status === 'completed' && (
          <View className="w-10 h-10 rounded-full bg-green-500 justify-center items-center">
            <Check size={20} color="#fff" />
          </View>
        )}
      </View>
    </View>
  );
};
