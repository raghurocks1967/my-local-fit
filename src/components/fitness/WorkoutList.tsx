import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Workout, DEFAULT_ACTIVITIES, INTENSITY_LABELS } from '@/types/fitness';
import { format, parseISO } from 'date-fns';
import { Edit2, Trash2, Clock, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface WorkoutListProps {
  workouts: Workout[];
  onEdit: (workout: Workout) => void;
  onDelete: (id: string) => void;
  className?: string;
}

export function WorkoutList({ workouts, onEdit, onDelete, className }: WorkoutListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const sortedWorkouts = [...workouts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const getActivityInfo = (workout: Workout) => {
    if (workout.activityType === 'custom') {
      return { label: workout.customActivityName || 'Custom', icon: '⭐' };
    }
    const activity = DEFAULT_ACTIVITIES.find(a => a.type === workout.activityType);
    return activity || { label: workout.activityType, icon: '🏃' };
  };

  if (workouts.length === 0) {
    return (
      <Card variant="ghost" className={cn("text-center py-12", className)}>
        <CardContent>
          <div className="text-4xl mb-4">🏃</div>
          <h3 className="font-semibold text-lg mb-2">No workouts yet</h3>
          <p className="text-muted-foreground">
            Start logging your activities to track your progress!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card variant="default" className={className}>
        <CardHeader>
          <CardTitle>Recent Workouts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {sortedWorkouts.slice(0, 10).map((workout, index) => {
            const { label, icon } = getActivityInfo(workout);
            const intensityInfo = INTENSITY_LABELS[workout.intensity];
            
            return (
              <div
                key={workout.id}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors",
                  "animate-fade-in"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Activity Icon */}
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-2xl">
                  {icon}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold truncate">{label}</h4>
                    <span 
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full",
                        intensityInfo.color === 'success' && "bg-success/10 text-success",
                        intensityInfo.color === 'accent' && "bg-accent/10 text-accent",
                        intensityInfo.color === 'destructive' && "bg-destructive/10 text-destructive"
                      )}
                    >
                      {intensityInfo.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {workout.duration} min
                    </span>
                    <span>{format(parseISO(workout.date), 'MMM d, yyyy')}</span>
                  </div>
                  {workout.notes && (
                    <p className="text-sm text-muted-foreground mt-1 truncate">
                      {workout.notes}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onEdit(workout)}
                    aria-label={`Edit ${label} workout`}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setDeleteId(workout.id)}
                    aria-label={`Delete ${label} workout`}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Workout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this workout? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) {
                  onDelete(deleteId);
                  setDeleteId(null);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
