'use client';
import { useState } from 'react';
import AppShell from '@/src/components/layout/AppShell';
import { Badge } from '@/src/components/ui';
import { useAppSelector } from '@/src/hooks/useAppSelector';
import { Trophy, Medal, TrendingUp, Brain, Star } from 'lucide-react';
import { useAppDispatch } from '@/src/hooks/useAppDispatch';
import { fetchLeaderboard } from '@/src/store/thunks/quiz.thunk';
import { useEffect } from 'react';

const RANK_ICONS = [
  <Trophy key={1} className="w-4 h-4 text-amber-500" />,
  <Medal key={2} className="w-4 h-4 text-neutral-400" />,
  <Medal key={3} className="w-4 h-4 text-amber-700" />,
];

const RANK_BG = [
  'from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/10 border-amber-200 dark:border-amber-900/40',
  'from-neutral-50 to-neutral-50 dark:from-neutral-900/80 dark:to-neutral-900/80 border-neutral-200 dark:border-neutral-800',
  'from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/10 border-orange-200 dark:border-orange-900/40',
];

export default function LeaderboardPage() {
  const user = useAppSelector((s) => s.auth.user);
  const [tab, setTab] = useState<'total' | 'avg'>('total');

  const dispatch = useAppDispatch();
  const { leaderboard } = useAppSelector((s) => s.quiz);

  useEffect(() => {
    dispatch(fetchLeaderboard(undefined)); // ya koi default limit jaise 20
  }, [dispatch]);

  const sorted = [...leaderboard].sort((a, b) =>
    tab === 'total' ? b.totalScore - a.totalScore : b.avgScore - a.avgScore
  );

  // const currentUserRank = sorted.findIndex((e) => e.isCurrentUser) + 1;

  const currentUserRank = sorted.findIndex((e) => e.userId === user?.publicId) + 1;

  const maxScore = Math.max(...sorted.map((e) => tab === 'total' ? e.totalScore : e.avgScore));
  const currentUser = sorted.find((e) => e.userId === user?.publicId);

  return (
    <AppShell title="Leaderboard">
      {/* Top 3 podium */}
      <div className="grid grid-cols-3 gap-3 mb-8 max-w-lg mx-auto">
        {[sorted[1], sorted[0], sorted[2]].map((entry, podiumIdx) => {
          if (!entry) return <div key={podiumIdx} />;
          const displayName = entry.name?.trim() || entry.userId || 'N/A';
          const displayInitial = displayName.charAt(0).toUpperCase();
          const displayLabel = displayName.split(' ')[0];
          const realRank = podiumIdx === 0 ? 2 : podiumIdx === 1 ? 1 : 3;
          const heights = ['h-20', 'h-28', 'h-16'];
          return (
            <div key={entry.userId} className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${entry.userId === user?.publicId ? 'bg-violet-600 text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                }`}>
                {displayInitial}
              </div>
              <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300 text-center leading-tight">{displayLabel}</p>
              <div className={`w-full ${heights[podiumIdx]} rounded-t-xl flex flex-col items-center justify-center gap-1 ${RANK_BG[realRank - 1]
                } border bg-gradient-to-b`}>
                {RANK_ICONS[realRank - 1]}
                <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                  {tab === 'total' ? entry.totalScore.toLocaleString() : `${entry.avgScore}%`}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Your rank card */}
      {currentUser && (
        <div className="bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800/50 rounded-2xl p-4 mb-6 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
            {user?.name?.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <p className="text-sm font-semibold text-violet-900 dark:text-violet-200">{user?.name}</p>
              <Badge variant="violet">You</Badge>
            </div>
            <p className="text-xs text-violet-600 dark:text-violet-400">
              Rank #{currentUserRank} · {currentUser.quizCount} quizzes · {currentUser.avgScore}% avg
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-lg font-bold text-violet-700 dark:text-violet-300">
              {tab === 'total' ? currentUser.totalScore.toLocaleString() : `${currentUser.avgScore}%`}
            </p>
            <p className="text-xs text-violet-400">
              {tab === 'total' ? 'total pts' : 'avg score'}
            </p>
          </div>
        </div>
      )}

      {/* Tab selector */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Rankings</h3>
        <div className="flex bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1">
          <button
            onClick={() => setTab('total')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${tab === 'total'
              ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
              : 'text-neutral-500 dark:text-neutral-400'
              }`}
          >
            <Star className="w-3 h-3" /> Total Score
          </button>
          <button
            onClick={() => setTab('avg')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${tab === 'avg'
              ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
              : 'text-neutral-500 dark:text-neutral-400'
              }`}
          >
            <TrendingUp className="w-3 h-3" /> Avg Score
          </button>
        </div>
      </div>

      {/* Full list */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
        {sorted.map((entry, idx) => {
          const rank = idx + 1;
          const score = tab === 'total' ? entry.totalScore : entry.avgScore;
          const barWidth = (score / maxScore) * 100;
        const isMe = entry.userId === user?.publicId;

          return (
            <div
              key={entry.userId}
              className={`flex items-center gap-4 px-5 py-3.5 border-b border-neutral-100 dark:border-neutral-800 last:border-0 transition-colors ${isMe ? 'bg-violet-50 dark:bg-violet-950/20' : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                }`}
            >
              {/* Rank */}
              <div className="w-8 shrink-0 text-center">
                {rank <= 3 ? RANK_ICONS[rank - 1] : (
                  <span className="text-sm font-semibold text-neutral-400 dark:text-neutral-500">{rank}</span>
                )}
              </div>

              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isMe ? 'bg-violet-600 text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                }`}>
                {(entry.name?.charAt(0) || entry.userId?.charAt(0) || 'N').toUpperCase()}
              </div>

              {/* Name & bar */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className={`text-sm font-medium truncate ${isMe ? 'text-violet-700 dark:text-violet-300' : 'text-neutral-800 dark:text-neutral-200'}`}>
                    {entry.name}
                  </p>
                  {isMe && <Badge variant="violet">You</Badge>}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${isMe ? 'bg-violet-500' : rank <= 3 ? 'bg-amber-400' : 'bg-neutral-300 dark:bg-neutral-600'}`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                  <span className="text-xs text-neutral-400 shrink-0">{entry.quizCount} quizzes</span>
                </div>
              </div>

              {/* Score */}
              <div className="text-right shrink-0">
                <p className={`text-sm font-bold ${isMe ? 'text-violet-700 dark:text-violet-300' : rank <= 3 ? 'text-amber-600 dark:text-amber-400' : 'text-neutral-700 dark:text-neutral-300'}`}>
                  {tab === 'total' ? score.toLocaleString() : `${score}%`}
                </p>
                <p className="text-xs text-neutral-400">{tab === 'total' ? 'pts' : 'avg'}</p>
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}