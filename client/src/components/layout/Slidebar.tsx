'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@/src/hooks/useAppSelector';
import { NAV_ITEMS } from '@/src/constants';
import {
  LayoutDashboard, Search, FileQuestion, Bookmark,
  Trophy, Flame, User, ChevronLeft, ChevronRight, Zap, History
} from 'lucide-react';

const ICONS: Record<string, React.ElementType> = {
  dashboard: LayoutDashboard,
  search: Search,
  quiz: FileQuestion,
  bookmark: Bookmark,
  leaderboard: Trophy,
  challenge: Flame,
  history: History,
  profile: User,

};

export default function Sidebar() {
  const pathname = usePathname();
  const sidebarOpen = useAppSelector((s) => s.ui.sidebarOpen);
  const user = useAppSelector((s) => s.auth.user);

  return (
    <aside
      className={`
        fixed left-0 top-0 h-full z-40 flex flex-col
        bg-white dark:bg-neutral-900
        border-r border-neutral-200 dark:border-neutral-800
        transition-all duration-300
        ${sidebarOpen ? 'w-56' : 'w-16'}
      `}
    >
      {/* Logo */}
      <div className={`flex items-center gap-2 px-4 h-16 border-b border-neutral-200 dark:border-neutral-800 shrink-0`}>
        <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center shrink-0">
          <Zap className="w-4 h-4 text-white" />
        </div>
        {sidebarOpen && (
          <span className="font-semibold text-neutral-900 dark:text-white text-sm">LearnAI</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = ICONS[item.icon];
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 mx-2 mb-1 px-3 py-2.5 rounded-lg
                text-sm transition-colors group
                ${active
                  ? 'bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-400 font-medium'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white'}
              `}
              title={!sidebarOpen ? item.label : undefined}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
              {!sidebarOpen && (
                <span className="absolute left-16 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User avatar */}
      {sidebarOpen && (
        <>
          {user && (
            <div className="px-4 py-3 border-t border-neutral-200 dark:border-neutral-800 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-violet-100 dark:bg-violet-900 flex items-center justify-center text-xs font-semibold text-violet-700 dark:text-violet-300 shrink-0">
                  {user.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-neutral-900 dark:text-white truncate">{user.name}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{user.email}</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </aside>
  );
}