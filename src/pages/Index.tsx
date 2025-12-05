import { useState, useEffect } from 'react';
import { useFitnessData } from '@/hooks/useFitnessData';
import { useWorkoutStats } from '@/hooks/useWorkoutStats';
import { Header } from '@/components/fitness/Header';
import { StatCard } from '@/components/fitness/StatCard';
import { WeeklyProgress } from '@/components/fitness/WeeklyProgress';
import { WeeklyChart } from '@/components/fitness/WeeklyChart';
import { WorkoutForm } from '@/components/fitness/WorkoutForm';
import { WorkoutList } from '@/components/fitness/WorkoutList';
import { DataManager } from '@/components/fitness/DataManager';
import { QuickAddButton } from '@/components/fitness/QuickAddButton';
import { Workout } from '@/types/fitness';
import { Clock, Flame, Calendar, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const {
    data,
    isLoaded,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    exportData,
    importData,
    clearAllData,
    updateSettings,
  } = useFitnessData();

  const stats = useWorkoutStats(data.workouts, data.settings.weeklyGoal);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);

  // Apply large text mode
  useEffect(() => {
    if (data.settings.largeTextMode) {
      document.body.classList.add('large-text');
    } else {
      document.body.classList.remove('large-text');
    }
  }, [data.settings.largeTextMode]);

  const handleAddWorkout = (workout: Omit<Workout, 'id' | 'createdAt' | 'updatedAt'>) => {
    addWorkout(workout);
    toast.success('Workout logged!', {
      description: `${workout.duration} minutes of activity recorded.`,
    });
  };

  const handleUpdateWorkout = (workout: Omit<Workout, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingWorkout) {
      updateWorkout(editingWorkout.id, workout);
      setEditingWorkout(null);
      toast.success('Workout updated!');
    }
  };

  const handleDeleteWorkout = (id: string) => {
    deleteWorkout(id);
    toast.success('Workout deleted');
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse-soft text-primary">
          <Clock className="h-8 w-8" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen bg-background")}>
      {/* Skip Link for Accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <Header />

      <main id="main-content" className="container py-6 pb-24 md:pb-6">
        {/* Welcome Section */}
        <section className="mb-8 animate-fade-in" aria-labelledby="welcome-heading">
          <h2 id="welcome-heading" className="text-2xl font-bold mb-2">
            {stats.todayCount > 0 ? 'Keep it up! 💪' : 'Ready to move?'}
          </h2>
          <p className="text-muted-foreground">
            {stats.streak > 0 
              ? `${stats.streak} day streak! You're on fire.` 
              : 'Start your fitness journey today.'}
          </p>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6" aria-label="Today's statistics">
          <StatCard
            label="Today"
            value={stats.todayDuration}
            unit="min"
            icon={<Clock className="h-5 w-5" />}
            variant="primary"
          />
          <StatCard
            label="This Week"
            value={stats.weeklyDuration}
            unit="min"
            icon={<TrendingUp className="h-5 w-5" />}
          />
          <StatCard
            label="This Month"
            value={stats.monthlyDuration}
            unit="min"
            icon={<Calendar className="h-5 w-5" />}
          />
          <StatCard
            label="Streak"
            value={stats.streak}
            unit="days"
            icon={<Flame className="h-5 w-5" />}
            variant="accent"
          />
        </section>

        {/* Main Content Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Left Column */}
              <div className="space-y-6">
                <WeeklyProgress 
                  current={stats.weeklyDuration} 
                  goal={stats.weeklyGoal} 
                />
                <WeeklyChart data={stats.weeklyChartData} />
              </div>

              {/* Right Column - Form */}
              <div className="hidden md:block">
                {editingWorkout ? (
                  <WorkoutForm
                    key={editingWorkout.id}
                    onSubmit={handleUpdateWorkout}
                    onCancel={() => setEditingWorkout(null)}
                    customActivities={data.customActivities}
                    initialData={editingWorkout}
                  />
                ) : (
                  <WorkoutForm
                    onSubmit={handleAddWorkout}
                    customActivities={data.customActivities}
                  />
                )}
              </div>
            </div>

            {/* Recent Workouts Preview */}
            {data.workouts.length > 0 && (
              <WorkoutList
                workouts={data.workouts.slice(0, 5)}
                onEdit={setEditingWorkout}
                onDelete={handleDeleteWorkout}
              />
            )}
          </TabsContent>

          <TabsContent value="history">
            <WorkoutList
              workouts={data.workouts}
              onEdit={setEditingWorkout}
              onDelete={handleDeleteWorkout}
            />
          </TabsContent>

          <TabsContent value="settings">
            <DataManager
              onExport={exportData}
              onImport={importData}
              onClearAll={clearAllData}
              settings={data.settings}
              onSettingsChange={updateSettings}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Mobile Quick Add */}
      <QuickAddButton 
        onSubmit={handleAddWorkout} 
        customActivities={data.customActivities} 
      />
    </div>
  );
};

export default Index;
