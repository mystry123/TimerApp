import { useState, useEffect } from 'react';
import { Timer } from '@/types/timer';
import { useStorage } from './useStorage';
import { useSettings } from '@/contexts/SettingContext';
import { Alert } from 'react-native';

export const useTimer = () => {
  const [timers, setTimers] = useState<Timer[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const { saveData,removeData,loadData } = useStorage();
  const { vibrate } = useSettings();

  useEffect(() => {
    loadTimers();
  }, []);

  // Timer tick effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((currentTimers) => {
        let updated = false;
        const updatedTimers = currentTimers.map((timer) => {
          if (timer.status === 'running' && timer.remainingTime > 0) {
            updated = true;
            const newRemainingTime = timer.remainingTime - 1;

            // Check for halfway alert
            let halfwayAlertTriggered = timer.halfwayAlertTriggered;
            if (
              timer.halfwayAlert &&
              !timer.halfwayAlertTriggered &&
              newRemainingTime <= timer.duration / 2
            ) {
              halfwayAlertTriggered = true;
              Alert.alert(
                'Halfway Alert',
                `${timer.name} is halfway complete!`

              );
            }

            // Check for timer completion
            if (newRemainingTime === 0) {
              saveTimerToHistory(timer);

              vibrate();
              Alert.alert('Timer Complete', `${timer.name} has finished!`, [{ text: 'OK', onPress: () => deleteTimer(timer.id) }]);
              return {
                ...timer,
                remainingTime: 0,
                status: 'completed' as 'completed',
                halfwayAlertTriggered,
              };
            }

            return {
              ...timer,
              remainingTime: newRemainingTime,
              halfwayAlertTriggered,
            };
          }
          return timer;
        });

        if (updated) {
          saveTimers(updatedTimers);
          return updatedTimers;
        }
        return currentTimers;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timers]);

  const loadTimers = async () => {
    try {
      const storedTimers = await loadData('timers');
      if (storedTimers) {
        setTimers(JSON.parse(storedTimers));
      }
    } catch (error) {
      console.error('Failed to load timers:', error);
    }
  };

  const saveTimers = async (timersToSave: Timer[]) => {
    try {
      await saveData('timers', JSON.stringify(timersToSave));
      setTimers(timersToSave.map(timer => ({
        ...timer,
        status: timer.status as 'idle' | 'running' | 'paused' | 'completed'
      })));
    } catch (error) {
      console.error('Failed to save timers:', error);
    }
  };

  const saveTimerToHistory = async (timer: Timer) => {
    try {
      const historyString = await loadData('timerHistory');
      const history = historyString ? JSON.parse(historyString) : [];
      const historyEntry = {
        ...timer,
        completedAt: new Date().toISOString(),
      };
      const updatedHistory = [historyEntry, ...history];
      await saveData('timerHistory', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Failed to save timer to history:', error);
    }
  };

  const addTimer = async (newTimer: Omit<Timer, 'id' | 'createdAt'>) => {
    const timer: Timer = {
      ...newTimer,
      id: Date.now().toString(),
      createdAt: Date.now(),
      status: 'idle'
    };

    const updatedTimers = [...timers, timer];
    await saveTimers(updatedTimers);

    if (!expandedCategories.includes(timer.category)) {
      setExpandedCategories([...expandedCategories, timer.category]);
    }
  };

  const startTimer = (id: string) => {
    console.log('Starting timer:', id);
    setTimers((currentTimers) => {
      const updatedTimers = currentTimers.map((timer) =>
        timer.id === id && timer.status !== 'completed'
          ? { ...timer, status: 'running' as 'running' }
          : timer
      );
      saveTimers(updatedTimers);
      return updatedTimers;
    });
  };

  const pauseTimer = (id: string) => {
    console.log('Pausing timer:', id);
    setTimers((currentTimers) => {
      const updatedTimers = currentTimers.map((timer) =>
        timer.id === id && timer.status === 'running'
          ? { ...timer, status: 'paused' as 'paused' }
          : timer
      );
      saveTimers(updatedTimers);
      return updatedTimers;
    });
  };

  const resetTimer = (id: string) => {
    const updatedTimers = timers.map((timer) =>
      timer.id === id
        ? {
          ...timer,
          remainingTime: timer.duration,
          status: 'idle' as 'idle',
          halfwayAlertTriggered: false,
        }
        : timer
    );
    saveTimers(updatedTimers);
  };

  const deleteTimer = async (id: string) => {
    const updatedTimers = timers.filter((timer) => timer.id !== id);
      await removeData('timers');
      await  saveTimers(updatedTimers);
  };

  const startAllInCategory = (category: string) => {
    const updatedTimers = timers.map((timer) =>
      timer.category === category && timer.status !== 'completed'
        ? { ...timer, status: 'running' as 'running' }
        : timer
    );
    saveTimers(updatedTimers);
  };

  const pauseAllInCategory = (category: string) => {
    const updatedTimers = timers.map((timer) =>
      timer.category === category && timer.status === 'running'
        ? { ...timer, status: 'paused' as 'paused' }
        : timer
    );
    saveTimers(updatedTimers);
  };

  const resetAllInCategory = (category: string) => {
    const updatedTimers = timers.map((timer) =>
      timer.category === category
        ? {
          ...timer,
          remainingTime: timer.duration,
          status: 'idle' as 'idle',
          halfwayAlertTriggered: false,
        }
        : timer
    );
    saveTimers(updatedTimers);
  };

  const toggleCategoryExpansion = (category: string) => {
    setExpandedCategories((current) =>
      current.includes(category)
        ? current.filter((c) => c !== category)
        : [...current, category]
    );
  };

  const getGroupedTimers = () => {
    return timers.reduce((groups, timer) => {
      const category = timer.category.trim();
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(timer);
      return groups;
    }, {} as { [key: string]: Timer[] });
  };

  return {
    timers,
    expandedCategories,
    addTimer,
    startTimer,
    pauseTimer,
    resetTimer,
    deleteTimer,
    startAllInCategory,
    pauseAllInCategory,
    resetAllInCategory,
    toggleCategoryExpansion,
    getGroupedTimers,
  };
};