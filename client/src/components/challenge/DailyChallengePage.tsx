'use client';
import { useState, useEffect } from 'react';
import AppShell from '@/src/components/layout/AppShell';
import { Badge, Button } from '@/src/components/ui';
import { useAppSelector } from '@/src/hooks/useAppSelector';
import { Flame, Clock, CheckCircle2, XCircle, Trophy, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppDispatch } from '@/src/hooks/useAppDispatch';
import { fetchTodayChallenge } from '@/src/store/thunks/dailyChallenge.thunk';

function Countdown() {
  const getMsUntilMidnight = () => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    return midnight.getTime() - now.getTime();
  };

  const fmt = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const [timeLeft, setTimeLeft] = useState(getMsUntilMidnight());

  useEffect(() => {
    const t = setInterval(() => setTimeLeft(getMsUntilMidnight()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <span className="font-mono text-sm font-semibold text-orange-600 dark:text-orange-400">
      {fmt(timeLeft)}
    </span>
  );
}

export default function DailyChallengePage() {
  // const { todayChallenge } = useAppSelector((s) => s.dailyChallenge);
  const { today: todayChallenge, loading } = useAppSelector((s) => s.dailyChallenge);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  const dispatch = useAppDispatch();

useEffect(() => {
  dispatch(fetchTodayChallenge());
}, [dispatch]);

  if (!todayChallenge) return (
    <AppShell title="Daily Challenge">
      <div className="flex items-center justify-center h-64">
        <p className="text-neutral-500 dark:text-neutral-400">No challenge available today.</p>
      </div>
    </AppShell>
  );

  const q = todayChallenge.questions[currentIdx];
  const total = todayChallenge.questions.length;
  const answered = Object.keys(answers).length;
  const correct = submitted
    ? todayChallenge.questions.filter((q: any, i: any) => answers[i]?.charAt(0) === q.answer).length
    : 0;
  const pct = submitted ? Math.round((correct / total) * 100) : 0;

  const handleSubmit = () => {
    if (answered < total) {
      toast.error(`Answer all questions first. (${answered}/${total})`);
      return;
    }
    setSubmitted(true);
    toast.success(pct >= 60 ? '🎉 Great score!' : 'Keep practising!');
  };

  if (loading) return (
  <AppShell title="Daily Challenge">
    <div className="flex items-center justify-center h-64">
      <p className="text-neutral-500 dark:text-neutral-400">Loading...</p>
    </div>
  </AppShell>
);

  return (
    <AppShell title="Daily Challenge">
      <div className="max-w-2xl mx-auto">
        {/* Hero header */}
        <div className="bg-gradient-to-br from-violet-600 to-violet-700 dark:from-violet-700 dark:to-violet-900 text-white rounded-2xl p-5 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-4 h-4 text-orange-300" />
                <span className="text-xs font-medium text-violet-200">Daily Challenge</span>
              </div>
              <h2 className="text-lg font-bold mb-1">{todayChallenge.topic}</h2>
              <div className="flex items-center gap-3">
                <Badge variant="violet">{total} questions</Badge>
                <Badge variant="violet">Intermediate</Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-violet-300 mb-1">Resets in</p>
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg">
                <Clock className="w-3.5 h-3.5 text-violet-200" />
                <Countdown />
              </div>
            </div>
          </div>

          {/* Progress dots */}
          {!submitted && (
            <div className="flex items-center gap-2 mt-4">
              {todayChallenge.questions.map((_: any, i: number) => (
                <button
                  key={i}
                  onClick={() => setCurrentIdx(i)}
                  className={`flex-1 h-1.5 rounded-full transition-all ${
                    i === currentIdx ? 'bg-white' : answers[i] ? 'bg-violet-300' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Submitted result */}
        {submitted ? (
          <div className="space-y-4 animate-slide-up">
            {/* Score */}
            <div className={`rounded-2xl p-5 text-center border ${
              pct >= 60
                ? 'bg-teal-50 dark:bg-teal-950/30 border-teal-200 dark:border-teal-900/40'
                : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/40'
            }`}>
              <Trophy className={`w-8 h-8 mx-auto mb-2 ${pct >= 60 ? 'text-teal-500' : 'text-rose-400'}`} />
              <p className={`text-4xl font-bold mb-1 ${pct >= 60 ? 'text-teal-600 dark:text-teal-400' : 'text-rose-500'}`}>{pct}%</p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">{correct}/{total} correct</p>
              <p className="text-xs text-neutral-400 mt-1">{pct >= 60 ? 'Great work! Come back tomorrow.' : 'Keep practising! You\'ve got this.'}</p>
            </div>

            {/* Answer review */}
            {todayChallenge.questions.map((question: any, i: number) => {
              const userAns = answers[i];
              const isCorrect = userAns?.charAt(0) === question.answer;
              return (
                <div key={i} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4">
                  <div className="flex items-start gap-2 mb-3">
                    {isCorrect
                      ? <CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" />
                      : <XCircle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />}
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">{question.question}</p>
                  </div>
                  <div className="space-y-1.5 mb-3">
                    {question.options.map((opt: any) => {
                      const isCorrectOpt = opt.charAt(0) === question.answer;
                      const isUserOpt = userAns?.charAt(0) === opt.charAt(0);
                      return (
                        <div key={opt} className={`px-3 py-2 rounded-lg text-xs flex items-center gap-2 ${
                          isCorrectOpt
                            ? 'bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300'
                            : isUserOpt && !isCorrectOpt
                            ? 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400'
                            : 'border border-neutral-100 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400'
                        }`}>
                          {isCorrectOpt && <CheckCircle2 className="w-3 h-3 shrink-0 text-teal-500" />}
                          {isUserOpt && !isCorrectOpt && <XCircle className="w-3 h-3 shrink-0 text-rose-500" />}
                          {opt}
                        </div>
                      );
                    })}
                  </div>
                  {question.explanation && (
                    <div className="bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/40 rounded-lg px-3 py-2">
                      <p className="text-xs text-violet-700 dark:text-violet-300">
                        <span className="font-medium">Explanation: </span>{question.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* Active question */
          <div className="animate-fade-in">
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 mb-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium text-neutral-400">Question {currentIdx + 1} of {total}</span>
                <span className="text-xs text-neutral-400">{answered}/{total} answered</span>
              </div>
              <p className="text-sm font-medium text-neutral-900 dark:text-white mb-4 leading-relaxed">{q.question}</p>
              <div className="space-y-2">
                {q.options.map((opt: any) => {
                  const selected = answers[currentIdx] === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => setAnswers((p) => ({ ...p, [currentIdx]: opt }))}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left text-sm transition-all ${
                        selected
                          ? 'bg-violet-50 dark:bg-violet-950/40 border-violet-400 dark:border-violet-600 text-violet-800 dark:text-violet-300 font-medium'
                          : 'border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-violet-300 dark:hover:border-violet-700 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-semibold shrink-0 ${
                        selected
                          ? 'bg-violet-600 border-violet-600 text-white'
                          : 'border-neutral-300 dark:border-neutral-600 text-neutral-500'
                      }`}>
                        {opt.charAt(0)}
                      </span>
                      {opt.substring(3)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button variant="secondary" onClick={() => setCurrentIdx((p) => Math.max(0, p - 1))} disabled={currentIdx === 0}>
                <ChevronLeft className="w-4 h-4" /> Prev
              </Button>
              {currentIdx < total - 1 ? (
                <Button onClick={() => setCurrentIdx((p) => p + 1)}>
                  Next <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={answered < total}>
                  Submit <CheckCircle2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}