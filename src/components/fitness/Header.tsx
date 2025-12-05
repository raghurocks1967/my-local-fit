import { Activity } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg fitness-gradient text-primary-foreground">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg">FitTrack</h1>
            <p className="text-xs text-muted-foreground">Privacy-first fitness</p>
          </div>
        </div>
        <nav aria-label="Main navigation">
          <span className="text-sm text-muted-foreground">
            100% Local • No Data Shared
          </span>
        </nav>
      </div>
    </header>
  );
}
