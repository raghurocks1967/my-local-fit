import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { WorkoutForm } from './WorkoutForm';
import { Workout, CustomActivity } from '@/types/fitness';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface QuickAddButtonProps {
  onSubmit: (workout: Omit<Workout, 'id' | 'createdAt' | 'updatedAt'>) => void;
  customActivities: CustomActivity[];
}

export function QuickAddButton({ onSubmit, customActivities }: QuickAddButtonProps) {
  const [open, setOpen] = useState(false);

  const handleSubmit = (workout: Omit<Workout, 'id' | 'createdAt' | 'updatedAt'>) => {
    onSubmit(workout);
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="fitness"
        size="xl"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg fitness-shadow-lg hover:scale-105 transition-transform md:hidden"
        aria-label="Log new workout"
      >
        <Plus className="h-6 w-6" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Log Workout</DialogTitle>
          </DialogHeader>
          <WorkoutForm
            onSubmit={handleSubmit}
            onCancel={() => setOpen(false)}
            customActivities={customActivities}
            className="border-0 shadow-none p-0"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
