//client/src/constants/index.ts


export const DIFFICULTY_COLORS = {
  beginner: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
  intermediate: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  advanced: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
} as const;

export const CONTENT_TYPE_COLORS = {
  text: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  video: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
  both: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
} as const;

export const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
  { label: 'Search', href: '/search', icon: 'search' },
  { label: 'My Quizzes', href: '/quiz', icon: 'quiz' },
  { label: 'Bookmarks', href: '/bookmarks', icon: 'bookmark' },
  { label: 'History', href: '/history', icon: 'history' },
  { label: 'Leaderboard', href: '/leaderboard', icon: 'leaderboard' },
  { label: 'Daily Challenge', href: '/daily-challenge', icon: 'challenge' },
  { label: 'Profile', href: '/profile', icon: 'profile' },
] as const;

export const AI_TIMEOUT_MS = 60_000;   // 60s for AI (Gemini can be slow)
export const API_TIMEOUT_MS = 15_000;  // 15s for regular API

export const QUIZ_NUM_OPTIONS = [5, 10, 15, 20, 30];