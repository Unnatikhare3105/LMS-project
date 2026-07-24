'use client';
import { useState } from 'react';
import AppShell from '@/src/components/layout/AppShell';
import { StatCard, Badge, Button } from '@/src/components/ui';
import { useAppSelector } from '@/src/hooks/useAppSelector';
import ActivityChart from './ActivityChart';
import {
  Flame, Brain, BookOpen, Trophy, User,
  Mail, Phone, Shield, LogOut, Edit2, Check, X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { useAppDispatch } from '@/src/hooks/useAppDispatch';
import { fetchAllQuizzes } from '@/src/store/thunks/quiz.thunk';
import { fetchAllBookmarks } from '@/src/store/thunks/bookmark.thunk';
import { useRouter } from 'next/navigation';
import { logoutUser } from '@/src/store/thunks/auth.thunk';

export default function ProfilePage() {
  const user = useAppSelector((s) => s.auth.user);
  const quizzes = useAppSelector((s) => s.quiz.quizzes);
  const bookmarks = useAppSelector((s) => s.bookmark.bookmarks);

  const [editName, setEditName] = useState(false);
  const [nameVal, setNameVal] = useState(user?.name ?? '');
  const router = useRouter();

const handleLogout = async () => {
  await dispatch(logoutUser());
  toast.success('Logged out successfully!');
  router.push('/auth');
};

  const completedQuizzes = quizzes.filter((q) => q.score !== null);
  const avgScore = completedQuizzes.length > 0
    ? Math.round(completedQuizzes.reduce((s, q) => s + (q.score! / q.totalQuestions) * 100, 0) / completedQuizzes.length)
    : 0;
  const bestScore = completedQuizzes.length > 0
    ? Math.max(...completedQuizzes.map((q) => Math.round((q.score! / q.totalQuestions) * 100)))
    : 0;

  const saveName = () => {
  setEditName(false);
  toast.success('Name updated!');
};

  const dispatch = useAppDispatch();

useEffect(() => {
  dispatch(fetchAllQuizzes());
  dispatch(fetchAllBookmarks());
}, [dispatch]);

  return (
    <AppShell title="Profile">
      <div className="max-w-4xl mx-auto">
        {/* Profile card */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-5">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-violet-100 dark:bg-violet-950/60 flex items-center justify-center text-2xl font-bold text-violet-600 dark:text-violet-400">
                {user?.name?.charAt(0)}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {editName ? (
                  <div className="flex items-center gap-2">
                    <input
                      value={nameVal}
                      onChange={(e) => setNameVal(e.target.value)}
                      className="bg-neutral-50 dark:bg-neutral-800 border border-violet-300 dark:border-violet-700 rounded-lg px-3 py-1.5 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                      autoFocus
                      onKeyDown={(e) => e.key === 'Enter' && saveName()}
                    />
                    <button onClick={saveName} className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-600">
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => { setEditName(false); setNameVal(user?.name ?? ''); }} className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">{nameVal}</h2>
                    <button onClick={() => setEditName(true)} className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-600 transition-colors">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{user?.email}</span>
                <Badge variant={user?.role === 'admin' ? 'rose' : user?.role === 'teacher' ? 'amber' : 'violet'}>
                  <Shield className="w-3 h-3 inline mr-1" />{user?.role}
                </Badge>
                {user?.accountVerified && <Badge variant="teal"><Check className="w-3 h-3 inline mr-1" />Verified</Badge>}
              </div>
            </div>

            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" /> Sign out
            </Button>
          </div>
        </div>

        {/* Streak + stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard label="Current Streak" value={`${user?.streak?.current ?? 0} 🔥`} sub={`Longest: ${user?.streak?.longest ?? 0}`} color="orange" />
          <StatCard label="Quizzes Taken" value={user?.totalQuizzesTaken ?? 0} sub={`${completedQuizzes.length} completed`} color="violet" />
          <StatCard label="Avg Score" value={`${avgScore}%`} sub={`Best: ${bestScore}%`} color="green" />
          <StatCard label="Topics Explored" value={user?.totalTopicsSearched ?? 0} sub={`${bookmarks.length} bookmarked`} />
        </div>

        {/* Activity chart */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-4 h-4 text-orange-500" />
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Learning Activity</h3>
          </div>
          <ActivityChart activityLog={user?.activityLog ?? []} />
        </div>

        {/* Quiz performance by difficulty */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
              <Brain className="w-4 h-4 text-violet-500" /> Performance by Difficulty
            </h3>
            {(['beginner', 'intermediate', 'advanced'] as const).map((diff) => {
              const dQuizzes = completedQuizzes.filter((q) => q.difficulty === diff);
              const dAvg = dQuizzes.length > 0
                ? Math.round(dQuizzes.reduce((s, q) => s + (q.score! / q.totalQuestions) * 100, 0) / dQuizzes.length)
                : 0;
              const colors = { beginner: 'bg-teal-500', intermediate: 'bg-amber-500', advanced: 'bg-rose-500' };
              const textColors = { beginner: 'text-teal-600 dark:text-teal-400', intermediate: 'text-amber-600 dark:text-amber-400', advanced: 'text-rose-600 dark:text-rose-400' };
              return (
                <div key={diff} className="mb-3 last:mb-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs capitalize text-neutral-600 dark:text-neutral-400">{diff}</span>
                    <span className={`text-xs font-semibold ${textColors[diff]}`}>
                      {dQuizzes.length > 0 ? `${dAvg}%` : 'No quizzes'}
                    </span>
                  </div>
                  <div className="h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div className={`h-full ${colors[diff]} rounded-full transition-all`} style={{ width: `${dAvg}%` }} />
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5">{dQuizzes.length} quiz{dQuizzes.length !== 1 ? 'zes' : ''}</p>
                </div>
              );
            })}
          </div>

          {/* Recent activity */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-500" /> Recent Quiz History
            </h3>
            <div className="space-y-2">
              {completedQuizzes.slice(0, 5).map((q) => {
                const pct = Math.round((q.score! / q.totalQuestions) * 100);
                return (
                  <div key={q.quizId} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${pct >= 70 ? 'bg-teal-500' : 'bg-rose-400'}`} />
                    <p className="text-xs text-neutral-700 dark:text-neutral-300 flex-1 truncate">{q.topic}</p>
                    <Badge variant={q.difficulty === 'beginner' ? 'teal' : q.difficulty === 'intermediate' ? 'amber' : 'rose'}>
                      {q.difficulty}
                    </Badge>
                    <span className={`text-xs font-semibold shrink-0 ${pct >= 70 ? 'text-teal-600 dark:text-teal-400' : 'text-rose-500'}`}>
                      {pct}%
                    </span>
                  </div>
                );
              })}
              {completedQuizzes.length === 0 && (
                <p className="text-xs text-neutral-400 dark:text-neutral-500 text-center py-4">No completed quizzes yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}


