import { useMemo } from 'react';
import { Workout } from '@/types/fitness';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval, parseISO, format, subDays, eachDayOfInterval, startOfDay } from 'date-fns';

export function useWorkoutStats(workouts: Workout[], weeklyGoal: number) {
  return useMemo(() => {
    const now = new Date();
    const today = startOfDay(now);
    
    // Today's workouts
    const todayWorkouts = workouts.filter(w => {
      const workoutDate = parseISO(w.date);
      return startOfDay(workoutDate).getTime() === today.getTime();
    });
    const todayDuration = todayWorkouts.reduce((sum, w) => sum + w.duration, 0);
    const todayCount = todayWorkouts.length;

    // This week's data
    const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    const thisWeekWorkouts = workouts.filter(w => 
      isWithinInterval(parseISO(w.date), { start: weekStart, end: weekEnd })
    );
    const weeklyDuration = thisWeekWorkouts.reduce((sum, w) => sum + w.duration, 0);
    const weeklyProgress = Math.min(100, (weeklyDuration / weeklyGoal) * 100);

    // This month's data
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const thisMonthWorkouts = workouts.filter(w =>
      isWithinInterval(parseISO(w.date), { start: monthStart, end: monthEnd })
    );
    const monthlyDuration = thisMonthWorkouts.reduce((sum, w) => sum + w.duration, 0);
    const monthlyCount = thisMonthWorkouts.length;

    // Weekly chart data (last 7 days)
    const last7Days = eachDayOfInterval({
      start: subDays(today, 6),
      end: today,
    });
    const weeklyChartData = last7Days.map(day => {
      const dayWorkouts = workouts.filter(w => {
        const workoutDate = startOfDay(parseISO(w.date));
        return workoutDate.getTime() === startOfDay(day).getTime();
      });
      return {
        day: format(day, 'EEE'),
        fullDate: format(day, 'MMM d'),
        duration: dayWorkouts.reduce((sum, w) => sum + w.duration, 0),
        count: dayWorkouts.length,
      };
    });

    // Monthly activity breakdown
    const activityBreakdown = thisMonthWorkouts.reduce((acc, w) => {
      const key = w.customActivityName || w.activityType;
      if (!acc[key]) {
        acc[key] = { duration: 0, count: 0 };
      }
      acc[key].duration += w.duration;
      acc[key].count += 1;
      return acc;
    }, {} as Record<string, { duration: number; count: number }>);

    // Streak calculation
    let streak = 0;
    let checkDate = today;
    while (true) {
      const dayWorkouts = workouts.filter(w => {
        const workoutDate = startOfDay(parseISO(w.date));
        return workoutDate.getTime() === startOfDay(checkDate).getTime();
      });
      if (dayWorkouts.length > 0) {
        streak++;
        checkDate = subDays(checkDate, 1);
      } else if (checkDate.getTime() === today.getTime()) {
        // If no workout today, check yesterday to continue streak
        checkDate = subDays(checkDate, 1);
      } else {
        break;
      }
    }

    return {
      todayDuration,
      todayCount,
      weeklyDuration,
      weeklyProgress,
      weeklyGoal,
      monthlyDuration,
      monthlyCount,
      weeklyChartData,
      activityBreakdown,
      streak,
      thisWeekWorkouts,
      thisMonthWorkouts,
    };
  }, [workouts, weeklyGoal]);
}
