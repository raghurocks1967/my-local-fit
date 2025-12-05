import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { cn } from '@/lib/utils';

interface ChartData {
  day: string;
  fullDate: string;
  duration: number;
  count: number;
}

interface WeeklyChartProps {
  data: ChartData[];
  className?: string;
}

export function WeeklyChart({ data, className }: WeeklyChartProps) {
  const maxDuration = Math.max(...data.map(d => d.duration), 30);
  
  return (
    <Card variant="default" className={cn("animate-slide-up", className)}>
      <CardHeader>
        <CardTitle>Last 7 Days</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]" role="img" aria-label="Bar chart showing workout duration over the last 7 days">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis 
                dataKey="day" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                domain={[0, maxDuration]}
                tickFormatter={(value) => `${value}m`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as ChartData;
                    return (
                      <div className="rounded-lg border bg-card p-3 shadow-lg">
                        <p className="text-sm font-medium">{data.fullDate}</p>
                        <p className="text-lg font-bold text-primary">{data.duration} min</p>
                        <p className="text-xs text-muted-foreground">
                          {data.count} workout{data.count !== 1 ? 's' : ''}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey="duration" 
                radius={[6, 6, 0, 0]}
                maxBarSize={40}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`}
                    fill={entry.duration > 0 ? 'hsl(var(--primary))' : 'hsl(var(--muted))'}
                    opacity={entry.duration > 0 ? 1 : 0.5}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
