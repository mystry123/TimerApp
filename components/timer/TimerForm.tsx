import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Switch,
} from 'react-native';
import { Timer } from '@/types/timer';
import Button from '../common/Button';
import * as yup from 'yup';
import { useColorScheme } from 'nativewind';

interface TimerFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (timer: Omit<Timer, 'id' | 'createdAt'>) => void;
}

const timerSchema = yup.object().shape({
  name: yup.string().required('Timer name is required'),
  category: yup.string().required('Category is required'),
  duration: yup
    .number()
    .required('Duration is required')
    .positive('Duration must be a positive number')
    .integer('Duration must be an integer'),
});

export const TimerForm = ({ visible, onClose, onSubmit }: TimerFormProps) => {
  const { colorScheme } = useColorScheme();
  const [newTimer, setNewTimer] = useState<Omit<Timer, 'id' | 'createdAt'>>({
    name: '',
    duration: 60,
    remainingTime: 60,
    category: '',
    status: 'idle',
    halfwayAlert: false,
    halfwayAlertTriggered: false,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const resetForm = () => {
    setNewTimer({
      name: '',
      duration: 60,
      remainingTime: 60,
      category: '',
      status: 'idle',
      halfwayAlert: false,
      halfwayAlertTriggered: false,
    });
    setErrors({});
  };

  const handleSubmit = async () => {
    try {
      await timerSchema.validate(newTimer, { abortEarly: false });
      onSubmit(newTimer);
      resetForm();
      onClose();
    } catch (validationErrors) {
      if (validationErrors instanceof yup.ValidationError) {
        const newErrors: { [key: string]: string } = {};
        validationErrors.inner.forEach((error) => {
          if (error.path) {
            newErrors[error.path] = error.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        resetForm();
        onClose();
      }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <View className="flex-1 bg-black/50 justify-end">
            <View className="bg-white dark:bg-gray-800 rounded-t-xl p-6">
              <Text className="text-xl font-bold text-gray-900 dark:text-white text-center mb-6">
                Add New Timer
              </Text>

              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Timer Name
                </Text>
                <TextInput
                  className={`bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-3 rounded-lg ${
                    errors.name ? 'border border-red-500' : ''
                  }`}
                  placeholder="e.g., Morning Workout"
                  placeholderTextColor={
                    colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'
                  }
                  value={newTimer.name}
                  onChangeText={(text) =>
                    setNewTimer({ ...newTimer, name: text })
                  }
                />
                {errors.name && (
                  <Text className="text-red-500">{errors.name}</Text>
                )}
              </View>

              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Category
                </Text>
                <TextInput
                  className={`bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-3 rounded-lg ${
                    errors.category ? 'border border-red-500' : ''
                  }`}
                  placeholder="e.g., Fitness"
                  placeholderTextColor={
                    colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'
                  }
                  value={newTimer.category}
                  onChangeText={(text) =>
                    setNewTimer({ ...newTimer, category: text })
                  }
                />
                {errors.category && (
                  <Text className="text-red-500">{errors.category}</Text>
                )}
              </View>

              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Duration (seconds)
                </Text>
                <TextInput
                  className={`bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-3 rounded-lg ${
                    errors.duration ? 'border border-red-500' : ''
                  }`}
                  placeholder="60"
                  keyboardType="number-pad"
                  value={
                    newTimer.duration > 0 ? newTimer.duration.toString() : ''
                  }
                  onChangeText={(text) => {
                    const duration = text === '' ? '' : parseInt(text) || 0;
                    setNewTimer({
                      ...newTimer,
                      duration: duration === '' ? 0 : duration,
                      remainingTime: duration === '' ? 0 : duration,
                    });
                  }}
                />
                {errors.duration && (
                  <Text className="text-red-500">{errors.duration}</Text>
                )}
              </View>

              <View className="mb-4">
                <View className="flex-row justify-between items-center">
                  <Text className="text-sm font-semibold text-gray-900 dark:text-white">
                    Halfway Alert
                  </Text>
                  <Switch
                    value={newTimer.halfwayAlert}
                    onValueChange={(value) =>
                      setNewTimer({ ...newTimer, halfwayAlert: value })
                    }
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={newTimer.halfwayAlert ? '#2563eb' : '#f4f3f4'}
                  />
                </View>
                <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Get notified when timer reaches halfway point
                </Text>
              </View>

              <View className="flex-row justify-between mt-6 gap-x-2">
                <Button
                  label="Cancel"
                  variant="secondary"
                  onPress={() => {
                    resetForm();
                    onClose();
                  }}
                  className="flex-1"
                />
                <Button
                  label="Save Timer"
                  variant="primary"
                  onPress={handleSubmit}
                  className="flex-1"
                />
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
