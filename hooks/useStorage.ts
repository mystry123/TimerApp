import AsyncStorage from '@react-native-async-storage/async-storage';

export const useStorage = () => {
  const saveData = async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error saving data for key ${key}:`, error);
      throw error;
    }
  };

  const loadData = async (key: string) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value;
    } catch (error) {
      console.error(`Error loading data for key ${key}:`, error);
      throw error;
    }
  };

  const removeData = async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing data for key ${key}:`, error);
      throw error;
    }
  };

  const clearAll = async () => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw error;
    }
  };

  return {
    saveData,
    loadData,
    removeData,
    clearAll,
  };
};