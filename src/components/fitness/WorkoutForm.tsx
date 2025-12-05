import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ActivityType, 
  IntensityLevel, 
  Workout, 
  DEFAULT_ACTIVITIES,
  CustomActivity 
} from '@/types/fitness';
import { format } from 'date-fns';
import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WorkoutFormProps {
  onSubmit: (workout: Omit<Workout, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel?: () => void;
  customActivities: CustomActivity[];
  initialData?: Workout;
  className?: string;
}

export function WorkoutForm({ 
  onSubmit, 
  onCancel, 
  customActivities,
  initialData,
  className 
}: WorkoutFormProps) {
  const [date, setDate] = useState(initialData?.date || format(new Date(), 'yyyy-MM-dd'));
  const [activityType, setActivityType] = useState<ActivityType>(initialData?.activityType || 'running');
  const [customActivityName, setCustomActivityName] = useState(initialData?.customActivityName || '');
  const [duration, setDuration] = useState(initialData?.duration?.toString() || '30');
  const [intensity, setIntensity] = useState<IntensityLevel>(initialData?.intensity || 'medium');
  const [notes, setNotes] = useState(initialData?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const durationNum = parseInt(duration, 10);
    if (isNaN(durationNum) || durationNum <= 0) return;

    onSubmit({
      date,
      activityType,
      customActivityName: activityType === 'custom' ? customActivityName : undefined,
      duration: durationNum,
      intensity,
      notes: notes.trim() || undefined,
    });

    // Reset form if not editing
    if (!initialData) {
      setDuration('30');
      setNotes('');
      setActivityType('running');
      setCustomActivityName('');
    }
  };

  const allActivities = [
    ...DEFAULT_ACTIVITIES,
    ...customActivities.map(a => ({ type: 'custom' as ActivityType, label: a.name, icon: a.icon || '⭐' })),
  ];

  return (
    <Card variant="elevated" className={cn("animate-scale-in", className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{initialData ? 'Edit Workout' : 'Log Workout'}</span>
          {onCancel && (
            <Button 
              variant="ghost" 
              size="icon-sm" 
              onClick={onCancel}
              aria-label="Cancel"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={format(new Date(), 'yyyy-MM-dd')}
              required
            />
          </div>

          {/* Activity Type */}
          <div className="space-y-2">
            <Label htmlFor="activity">Activity</Label>
            <Select value={activityType} onValueChange={(v) => setActivityType(v as ActivityType)}>
              <SelectTrigger id="activity">
                <SelectValue placeholder="Select activity" />
              </SelectTrigger>
              <SelectContent>
                {DEFAULT_ACTIVITIES.map((activity) => (
                  <SelectItem key={activity.type} value={activity.type}>
                    <span className="flex items-center gap-2">
                      <span>{activity.icon}</span>
                      <span>{activity.label}</span>
                    </span>
                  </SelectItem>
                ))}
                {customActivities.map((activity) => (
                  <SelectItem key={`custom-${activity.id}`} value="custom">
                    <span className="flex items-center gap-2">
                      <span>{activity.icon || '⭐'}</span>
                      <span>{activity.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Custom Activity Name */}
          {activityType === 'custom' && (
            <div className="space-y-2">
              <Label htmlFor="customName">Activity Name</Label>
              <Input
                id="customName"
                value={customActivityName}
                onChange={(e) => setCustomActivityName(e.target.value)}
                placeholder="e.g., Rock Climbing"
                required
              />
            </div>
          )}

          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              min="1"
              max="600"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
            />
          </div>

          {/* Intensity */}
          <div className="space-y-2">
            <Label htmlFor="intensity">Intensity</Label>
            <Select value={intensity} onValueChange={(v) => setIntensity(v as IntensityLevel)}>
              <SelectTrigger id="intensity">
                <SelectValue placeholder="Select intensity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-success" />
                    Low
                  </span>
                </SelectItem>
                <SelectItem value="medium">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-accent" />
                    Medium
                  </span>
                </SelectItem>
                <SelectItem value="high">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-destructive" />
                    High
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How did it go?"
              rows={3}
            />
          </div>

          {/* Submit */}
          <div className="flex gap-2 pt-2">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                Cancel
              </Button>
            )}
            <Button type="submit" variant="fitness" className="flex-1">
              <Plus className="h-4 w-4" />
              {initialData ? 'Update' : 'Log Workout'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
