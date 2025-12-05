import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface WeeklyProgressProps {
  current: number;
  goal: number;
  className?: string;
}

export function WeeklyProgress({ current, goal, className }: WeeklyProgressProps) {
  const percentage = Math.min(100, (current / goal) * 100);
  const remaining = Math.max(0, goal - current);
  
  return (
    <Card variant="fitness" className={cn("animate-slide-up", className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Weekly Goal</span>
          <span className="text-sm font-normal text-muted-foreground">
            {Math.round(percentage)}% complete
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Progress 
            value={percentage} 
            className="h-3 bg-secondary"
            aria-label={`Weekly progress: ${current} of ${goal} minutes`}
          />
          <div className="flex justify-between text-sm">
            <span className="font-semibold text-primary">{current} min</span>
            <span className="text-muted-foreground">{goal} min goal</span>
          </div>
        </div>
        
        {percentage >= 100 ? (
          <div className="flex items-center gap-2 rounded-lg bg-success/10 p-3 text-success">
            <span className="text-lg">🎉</span>
            <span className="font-medium">Goal achieved! Great work!</span>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{remaining} minutes</span> remaining to reach your goal
          </p>
        )}
      </CardContent>
    </Card>
  );
}
