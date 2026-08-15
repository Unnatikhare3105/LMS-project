'use client';
import { useAppDispatch } from '@/src/hooks/useAppDispatch';
import { useAppSelector } from '@/src/hooks/useAppSelector';
import { toggleSidebar, toggleTheme } from '@/src/store/slices/uiSlice';
import { Menu, Sun, Moon, Bell, Flame } from 'lucide-react';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((s) => s.ui.theme);

  const streak = useAppSelector((s) => s.auth.user?.streak.current ?? 0);

 
  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 transition-colors"
        >
          <Menu className="w-4 h-4" />
        </button>
        <h1 className="text-base font-semibold text-neutral-900 dark:text-white">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Streak badge */}
        {streak > 0 && (
          <div className="flex items-center gap-1.5 bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 px-3 py-1.5 rounded-full text-xs font-medium">
            <Flame className="w-3.5 h-3.5" />
            {streak} day streak
          </div>
        )}

        {/* Theme toggle */}
        <button
          onClick={() => dispatch(toggleTheme())}
          className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 transition-colors"
          title="Toggle theme"
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        {/* Notifications placeholder */}
        <button className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-violet-500 rounded-full" />
        </button>
      </div>
    </header>
  );
}