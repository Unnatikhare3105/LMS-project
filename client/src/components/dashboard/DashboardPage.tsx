'use client';
import { useAppSelector } from '@/src/hooks/useAppSelector';
import AppShell from '@/src/components/layout/AppShell';
import { StatCard, Badge } from '@/src/components/ui';
import { Flame, BookOpen, Brain, TrendingUp, ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';
import { DIFFICULTY_COLORS, CONTENT_TYPE_COLORS } from '@/src/constants';
import { useEffect } from 'react';
import { useAppDispatch } from '@/src/hooks/useAppDispatch';
import { fetchAllTopicsThunk } from '@/src/store/thunks/syllabus.thunk';
import { fetchAllQuizzes } from '@/src/store/thunks/quiz.thunk';

export default function DashboardPage() {
  const user = useAppSelector((s) => s.auth.user);
  const topics = useAppSelector((s) => s.syllabus.topics);
  const quizzes = useAppSelector((s) => s.quiz.quizzes);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAllTopicsThunk());
    dispatch(fetchAllQuizzes());
  }, [dispatch]);

  const completedQuizzes = quizzes.filter((q) => q.score !== null);
  const avgScore =
    completedQuizzes.length > 0
      ? Math.round(
        completedQuizzes.reduce((sum, q) => sum + (q.score! / q.totalQuestions) * 100, 0) /
        completedQuizzes.length
      )
      : 0;

  const recentTopics = topics.slice(0, 6);
  const recentQuizzes = completedQuizzes.slice(0, 4);
  const streakCurrent = user?.streak?.current ?? 0;
  const streakLongest = user?.streak?.longest ?? 0;

  return (
    <AppShell title="Dashboard">
      {/* Welcome */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
          Here's your learning summary for today.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Day Streak"
          value={user?.streak?.current ?? 0}
          sub={`Longest: ${user?.streak?.longest ?? 0} days`}
          color="orange"
        />
        <StatCard
          label="Quizzes Taken"
          value={user?.totalQuizzesTaken ?? 0}
          sub={`${completedQuizzes.length} completed`}
          color="violet"
        />
        <StatCard
          label="Topics Searched"
          value={user?.totalTopicsSearched ?? 0}
          sub="Keep exploring!"
          color="default"
        />
        <StatCard
          label="Avg Score"
          value={`${avgScore}%`}
          sub="Across all quizzes"
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent topics */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Recent Topics</h3>
            <Link
              href="/search"
              className="flex items-center gap-1 text-xs text-violet-600 dark:text-violet-400 hover:underline"
            >
              Search new <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recentTopics.length === 0 ? (
              <div className="col-span-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 text-center">
                <BookOpen className="w-8 h-8 text-neutral-300 dark:text-neutral-700 mx-auto mb-2" />
                <p className="text-sm text-neutral-500 dark:text-neutral-400">No topics yet.</p>
                <Link href="/search" className="text-xs text-violet-600 dark:text-violet-400 mt-1 inline-block hover:underline">
                  Search your first topic →
                </Link>
              </div>
            ) : (
              recentTopics.map((t) => (
                <Link
                  key={t.syllabusId}
                  href="/search"
                  className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 hover:border-violet-300 dark:hover:border-violet-700 transition-colors group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-medium text-neutral-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                      {t.topic}
                    </p>
                    <Badge variant={t.contentType === 'text' ? 'violet' : t.contentType === 'video' ? 'teal' : 'blue'}>
                      {t.contentType}
                    </Badge>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                    {t.content
                      ? `${t.content.replace(/#+\s/g, '').replace(/\*\*/g, '').slice(0, 90)}...`
                      : 'Video content available'}...
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-neutral-400 dark:text-neutral-500">
                    <Clock className="w-3 h-3" />
                    {new Date(t.createdAt).toLocaleDateString()}
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* Streak card */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/20 border border-orange-200 dark:border-orange-900/40 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-orange-700 dark:text-orange-400">Learning Streak</span>
            </div>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-bold text-orange-500">{streakCurrent}</span>
              <span className="text-sm text-orange-600 dark:text-orange-400 mb-1">days</span>
            </div>
            <p className="text-xs text-orange-500/80 dark:text-orange-400/70 mt-1">
              Longest: {streakLongest} days
            </p>
            <div className="mt-3 h-1 bg-orange-200 dark:bg-orange-900/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 rounded-full transition-all"
                style={{ width: `${Math.min((streakCurrent ?? 0) / 30 * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-orange-400 mt-1">{30 - streakCurrent} days to 30-day milestone</p>
          </div>

          {/* Recent quiz results */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Recent Quizzes</h3>
              <Link href="/quiz" className="text-xs text-violet-600 dark:text-violet-400 hover:underline">
                View all
              </Link>
            </div>
            {recentQuizzes.length === 0 ? (
              <p className="text-xs text-neutral-400 dark:text-neutral-500 text-center py-4">No quizzes yet</p>
            ) : (
              <div className="space-y-2">
                {recentQuizzes.map((q) => {
                  const pct = Math.round((q.score! / q.totalQuestions) * 100);
                  return (
                    <div key={q.quizId} className="flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-neutral-800 dark:text-neutral-200 truncate">{q.topic}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Badge variant={q.difficulty === 'beginner' ? 'teal' : q.difficulty === 'intermediate' ? 'amber' : 'rose'}>
                            {q.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className={`text-sm font-semibold ${pct >= 70 ? 'text-teal-600 dark:text-teal-400' : 'text-rose-500 dark:text-rose-400'}`}>
                          {pct}%
                        </span>
                        <p className="text-xs text-neutral-400">{q.score}/{q.totalQuestions}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Daily challenge CTA */}
          <Link
            href="/daily-challenge"
            className="bg-gradient-to-br from-violet-600 to-violet-700 text-white rounded-xl p-4 flex items-center justify-between group hover:from-violet-700 hover:to-violet-800 transition-all"
          >
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <Brain className="w-4 h-4" />
                <span className="text-sm font-semibold">Daily Challenge</span>
              </div>
              <p className="text-xs text-violet-200">A new quiz every day!</p>
            </div>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </AppShell>
  );
}