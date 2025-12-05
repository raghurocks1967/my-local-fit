import { useState, useEffect, useCallback } from 'react';
import { FitnessData, Workout, CustomActivity, AppSettings } from '@/types/fitness';

const STORAGE_KEY = 'fitness-tracker-data';

const DEFAULT_DATA: FitnessData = {
  workouts: [],
  customActivities: [],
  settings: {
    largeTextMode: false,
    weeklyGoal: 150, // WHO recommends 150 min/week
  },
};

export function useFitnessData() {
  const [data, setData] = useState<FitnessData>(DEFAULT_DATA);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as FitnessData;
        setData({
          ...DEFAULT_DATA,
          ...parsed,
          settings: { ...DEFAULT_DATA.settings, ...parsed.settings },
        });
      }
    } catch (error) {
      console.error('Failed to load fitness data:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (error) {
        console.error('Failed to save fitness data:', error);
      }
    }
  }, [data, isLoaded]);

  // Workout CRUD operations
  const addWorkout = useCallback((workout: Omit<Workout, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newWorkout: Workout = {
      ...workout,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    setData(prev => ({
      ...prev,
      workouts: [...prev.workouts, newWorkout],
    }));
    return newWorkout;
  }, []);

  const updateWorkout = useCallback((id: string, updates: Partial<Omit<Workout, 'id' | 'createdAt'>>) => {
    setData(prev => ({
      ...prev,
      workouts: prev.workouts.map(w =>
        w.id === id
          ? { ...w, ...updates, updatedAt: new Date().toISOString() }
          : w
      ),
    }));
  }, []);

  const deleteWorkout = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      workouts: prev.workouts.filter(w => w.id !== id),
    }));
  }, []);

  // Custom activities
  const addCustomActivity = useCallback((activity: Omit<CustomActivity, 'id'>) => {
    const newActivity: CustomActivity = {
      ...activity,
      id: crypto.randomUUID(),
    };
    setData(prev => ({
      ...prev,
      customActivities: [...prev.customActivities, newActivity],
    }));
    return newActivity;
  }, []);

  const deleteCustomActivity = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      customActivities: prev.customActivities.filter(a => a.id !== id),
    }));
  }, []);

  // Settings
  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setData(prev => ({
      ...prev,
      settings: { ...prev.settings, ...updates },
    }));
  }, []);

  // Export/Import
  const exportData = useCallback(() => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fitness-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [data]);

  const importData = useCallback((jsonData: string) => {
    try {
      const parsed = JSON.parse(jsonData) as FitnessData;
      if (parsed.workouts && Array.isArray(parsed.workouts)) {
        setData({
          ...DEFAULT_DATA,
          ...parsed,
          settings: { ...DEFAULT_DATA.settings, ...parsed.settings },
        });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const clearAllData = useCallback(() => {
    setData(DEFAULT_DATA);
  }, []);

  return {
    data,
    isLoaded,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    addCustomActivity,
    deleteCustomActivity,
    updateSettings,
    exportData,
    importData,
    clearAllData,
  };
}
