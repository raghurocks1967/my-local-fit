import { useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Upload, Trash2, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
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
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { AppSettings } from '@/types/fitness';

interface DataManagerProps {
  onExport: () => void;
  onImport: (data: string) => boolean;
  onClearAll: () => void;
  settings: AppSettings;
  onSettingsChange: (updates: Partial<AppSettings>) => void;
  className?: string;
}

export function DataManager({ 
  onExport, 
  onImport, 
  onClearAll,
  settings,
  onSettingsChange,
  className 
}: DataManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [weeklyGoal, setWeeklyGoal] = useState(settings.weeklyGoal.toString());

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = onImport(content);
      if (success) {
        toast.success('Data imported successfully!');
      } else {
        toast.error('Failed to import data. Invalid format.');
      }
    };
    reader.readAsText(file);

    // Reset input
    e.target.value = '';
  };

  const handleGoalChange = () => {
    const goal = parseInt(weeklyGoal, 10);
    if (!isNaN(goal) && goal > 0) {
      onSettingsChange({ weeklyGoal: goal });
      toast.success('Weekly goal updated!');
    }
  };

  return (
    <>
      <Card variant="default" className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings & Data
          </CardTitle>
          <CardDescription>
            Manage your preferences and data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Accessibility */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Accessibility
            </h4>
            <div className="flex items-center justify-between">
              <Label htmlFor="large-text" className="flex flex-col gap-1">
                <span>Large Text Mode</span>
                <span className="text-sm text-muted-foreground font-normal">
                  Increase text size for better readability
                </span>
              </Label>
              <Switch
                id="large-text"
                checked={settings.largeTextMode}
                onCheckedChange={(checked) => onSettingsChange({ largeTextMode: checked })}
              />
            </div>
          </div>

          {/* Weekly Goal */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Weekly Goal
            </h4>
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="weekly-goal" className="sr-only">Weekly goal in minutes</Label>
                <Input
                  id="weekly-goal"
                  type="number"
                  min="1"
                  value={weeklyGoal}
                  onChange={(e) => setWeeklyGoal(e.target.value)}
                  placeholder="150"
                />
              </div>
              <Button 
                variant="outline" 
                onClick={handleGoalChange}
                disabled={weeklyGoal === settings.weeklyGoal.toString()}
              >
                Update
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              WHO recommends at least 150 minutes of moderate activity per week.
            </p>
          </div>

          {/* Data Management */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Data Management
            </h4>
            <div className="grid gap-2">
              <Button variant="outline" onClick={onExport} className="justify-start">
                <Download className="h-4 w-4 mr-2" />
                Export Data (JSON)
              </Button>
              <Button 
                variant="outline" 
                onClick={() => fileInputRef.current?.click()}
                className="justify-start"
              >
                <Upload className="h-4 w-4 mr-2" />
                Import Data
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileSelect}
                className="hidden"
                aria-label="Import data file"
              />
              <Button 
                variant="outline" 
                onClick={() => setShowClearDialog(true)}
                className="justify-start text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All Data
              </Button>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="rounded-lg bg-secondary/50 p-4">
            <h4 className="font-medium mb-2">🔒 Privacy First</h4>
            <p className="text-sm text-muted-foreground">
              All your data is stored locally on your device. Nothing is sent to any server.
              Export your data regularly to keep a backup.
            </p>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All Data</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all your workouts, custom activities, and settings. 
              This action cannot be undone. Consider exporting your data first.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onClearAll();
                toast.success('All data cleared');
                setShowClearDialog(false);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Clear All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
