import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
  variant?: 'default' | 'primary' | 'accent';
}

export function StatCard({ 
  label, 
  value, 
  unit, 
  icon, 
  trend,
  className,
  variant = 'default' 
}: StatCardProps) {
  return (
    <Card 
      variant="stat" 
      className={cn(
        "animate-fade-in",
        variant === 'primary' && "border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10",
        variant === 'accent' && "border-accent/30 bg-gradient-to-br from-accent/5 to-accent/10",
        className
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {label}
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold stat-number text-foreground">
                {value}
              </span>
              {unit && (
                <span className="text-sm text-muted-foreground">{unit}</span>
              )}
            </div>
          </div>
          {icon && (
            <div className={cn(
              "p-2 rounded-lg",
              variant === 'primary' && "bg-primary/10 text-primary",
              variant === 'accent' && "bg-accent/10 text-accent",
              variant === 'default' && "bg-secondary text-secondary-foreground"
            )}>
              {icon}
            </div>
          )}
        </div>
        {trend && (
          <div className={cn(
            "mt-2 text-xs font-medium",
            trend === 'up' && "text-success",
            trend === 'down' && "text-destructive",
            trend === 'neutral' && "text-muted-foreground"
          )}>
            {trend === 'up' && '↑ Improving'}
            {trend === 'down' && '↓ Declining'}
            {trend === 'neutral' && '→ Steady'}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
