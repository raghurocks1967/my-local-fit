export type ActivityType = 
  | 'running'
  | 'walking'
  | 'lifting'
  | 'cycling'
  | 'yoga'
  | 'swimming'
  | 'hiking'
  | 'custom';

export type IntensityLevel = 'low' | 'medium' | 'high';

export interface Workout {
  id: string;
  date: string; // ISO date string
  activityType: ActivityType;
  customActivityName?: string;
  duration: number; // in minutes
  intensity: IntensityLevel;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomActivity {
  id: string;
  name: string;
  icon?: string;
}

export interface FitnessData {
  workouts: Workout[];
  customActivities: CustomActivity[];
  settings: AppSettings;
}

export interface AppSettings {
  largeTextMode: boolean;
  weeklyGoal: number; // in minutes
}

export const DEFAULT_ACTIVITIES: { type: ActivityType; label: string; icon: string }[] = [
  { type: 'running', label: 'Running', icon: '🏃' },
  { type: 'walking', label: 'Walking', icon: '🚶' },
  { type: 'lifting', label: 'Weight Lifting', icon: '🏋️' },
  { type: 'cycling', label: 'Cycling', icon: '🚴' },
  { type: 'yoga', label: 'Yoga', icon: '🧘' },
  { type: 'swimming', label: 'Swimming', icon: '🏊' },
  { type: 'hiking', label: 'Hiking', icon: '🥾' },
];

export const INTENSITY_LABELS: Record<IntensityLevel, { label: string; color: string }> = {
  low: { label: 'Low', color: 'success' },
  medium: { label: 'Medium', color: 'accent' },
  high: { label: 'High', color: 'destructive' },
};
