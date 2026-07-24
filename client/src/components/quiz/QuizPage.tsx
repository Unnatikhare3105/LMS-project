'use client';
import { useEffect, useState } from 'react';
import AppShell from '@/src/components/layout/AppShell';
import { Badge, Button, AILoader, Empty } from '@/src/components/ui';
import { useAppSelector } from '@/src/hooks/useAppSelector';
import { useAppDispatch } from '@/src/hooks/useAppDispatch';
import GenerateModal from '../modals/GenerateModal';
import {
  setCurrentQuiz, selectAnswer, nextQuestion,
  prevQuestion, markSubmitted, clearCurrentQuiz,
} from '@/src/store/slices/quizSlice';
import { IQuiz, Difficulty } from '@/src/types';
import {
  FileQuestion, Plus, Clock, CheckCircle2, XCircle,
  ChevronLeft, ChevronRight, Trophy, RotateCcw, Trash2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { QUIZ_NUM_OPTIONS } from '@/src/constants';
import { generateQuiz, fetchAllQuizzes, fetchQuizById, deleteQuiz, submitQuiz } from '@/src/store/thunks/quiz.thunk';

const DIFF_VARIANTS = { beginner: 'teal', intermediate: 'amber', advanced: 'rose' } as const;

// ─── Generate Modal ────────────────────────────────────────────────────────────
// function GenerateModal({ onClose, onGenerate }: { onClose: () => void; onGenerate: (s: string, n: number, d: Difficulty) => void }) {
//   const topics = useAppSelector((s) => s.syllabus.topics);
//   const [syllabusId, setSyllabusId] = useState(topics[0]?.syllabusId ?? '');
//   const [num, setNum] = useState(5);
//   const [diff, setDiff] = useState<Difficulty>('intermediate');

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
//       <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 w-full max-w-sm animate-slide-up">
//         <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-4">Generate Quiz</h3>

//         <div className="space-y-4">
//           <div>
//             <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">Topic</label>
//             <select
//               value={syllabusId}
//               onChange={(e) => setSyllabusId(e.target.value)}
//               className="w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/30"
//             >
//               {topics.map((t) => <option key={t.syllabusId} value={t.syllabusId}>{t.topic}</option>)}
//             </select>
//           </div>

//           <div>
//             <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">Difficulty</label>
//             <div className="flex gap-2">
//               {(['beginner', 'intermediate', 'advanced'] as Difficulty[]).map((d) => (
//                 <button
//                   key={d}
//                   onClick={() => setDiff(d)}
//                   className={`flex-1 py-1.5 text-xs font-medium rounded-lg border transition-colors capitalize ${diff === d
//                     ? 'bg-violet-600 border-violet-600 text-white'
//                     : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-violet-400'
//                     }`}
//                 >
//                   {d}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div>
//             <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">Number of Questions</label>
//             <div className="flex gap-2 flex-wrap">
//               {QUIZ_NUM_OPTIONS.map((n) => (
//                 <button
//                   key={n}
//                   onClick={() => setNum(n)}
//                   className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${num === n
//                     ? 'bg-violet-600 border-violet-600 text-white'
//                     : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-violet-400'
//                     }`}
//                 >
//                   {n}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         <div className="flex gap-2 mt-6">
//           <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
//           <Button
//             onClick={() => { onGenerate(syllabusId, num, diff); onClose(); }}
//             className="flex-1"
//             disabled={!syllabusId}
//           >
//             Generate
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }

// ─── Quiz Result ───────────────────────────────────────────────────────────────
function QuizResult({ quiz, answers, onRetry, onBack }: {
  quiz: IQuiz;
  answers: Record<number, string>;
  onRetry: () => void;
  onBack: () => void;
}) {
  const correct = quiz.questions?.filter((q, i) => answers[i]?.charAt(0) === q.answer).length ?? 0;
  const pct = Math.round((correct / quiz.totalQuestions) * 100);
  const passed = pct >= 60;

  return (
    <div className="max-w-2xl mx-auto animate-slide-up">
      {/* Score card */}
      <div className={`rounded-2xl p-6 mb-6 text-center ${passed
        ? 'bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/40'
        : 'bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40'}`}>
        <Trophy className={`w-10 h-10 mx-auto mb-3 ${passed ? 'text-teal-500' : 'text-rose-400'}`} />
        <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">{quiz.topic}</p>
        <p className={`text-5xl font-bold mb-1 ${passed ? 'text-teal-600 dark:text-teal-400' : 'text-rose-500'}`}>{pct}%</p>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">{correct} / {quiz.totalQuestions} correct</p>
        <Badge variant={quiz.difficulty === 'beginner' ? 'teal' : quiz.difficulty === 'intermediate' ? 'amber' : 'rose'} >
          {quiz.difficulty}
        </Badge>
      </div>

      {/* Answer review */}
      <div className="space-y-4 mb-6">
        {quiz.questions.map((q, i) => {
          const userAns = answers[i];
          const isCorrect = userAns?.charAt(0) === q.answer;
          return (
            <div key={i} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4">
              <div className="flex items-start gap-2 mb-3">
                {isCorrect
                  ? <CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" />
                  : <XCircle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />}
                <p className="text-sm font-medium text-neutral-900 dark:text-white">{q.question}</p>
              </div>
              <div className="space-y-1.5 mb-3">
                {q.options.map((opt) => {
                  const optLetter = opt.charAt(0);
                  const isCorrectOpt = optLetter === q.answer;
                  const isUserOpt = userAns?.charAt(0) === optLetter;
                  return (
                    <div key={opt} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${isCorrectOpt
                      ? 'bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300'
                      : isUserOpt && !isCorrectOpt
                        ? 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400'
                        : 'border border-neutral-100 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400'
                      }`}>
                      {isCorrectOpt && <CheckCircle2 className="w-3 h-3 text-teal-500 shrink-0" />}
                      {isUserOpt && !isCorrectOpt && <XCircle className="w-3 h-3 text-rose-500 shrink-0" />}
                      {opt}
                    </div>
                  );
                })}
              </div>
              {q.explanation && (
                <div className="bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/40 rounded-lg px-3 py-2">
                  <p className="text-xs text-violet-700 dark:text-violet-300"><span className="font-medium">Explanation: </span>{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={onBack} className="flex-1"><ChevronLeft className="w-4 h-4" /> Back</Button>
        <Button onClick={onRetry} className="flex-1"><RotateCcw className="w-4 h-4" /> Retry</Button>
      </div>
    </div>
  );
}

// ─── Active Quiz ───────────────────────────────────────────────────────────────
function ActiveQuiz() {
  const dispatch = useAppDispatch();
  const { currentQuiz, currentQuestionIndex, selectedAnswers, submitted } = useAppSelector((s) => s.quiz);
  const [startTime] = useState(Date.now());

  if (!currentQuiz) return null;

  if (!currentQuiz.questions?.length) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Empty
          icon={<FileQuestion className="w-10 h-10" />}
          title="Quiz not available"
          description="Question details are missing. Please go back and open the quiz again."
        />
      </div>
    );
  }

  if (submitted) {
    return (
      <QuizResult
        quiz={currentQuiz}
        answers={selectedAnswers}
        onRetry={() => { dispatch(setCurrentQuiz(currentQuiz))}}
        onBack={() => dispatch(clearCurrentQuiz())}
      />
    );
  }

  const q = currentQuiz.questions[currentQuestionIndex];
  const total = currentQuiz.questions.length;
  const answered = Object.keys(selectedAnswers).length;
  const progress = ((currentQuestionIndex + 1) / total) * 100;

  // const handleSubmit = () => {
  //   if (answered < total) {
  //     toast.error(`Please answer all questions. (${answered}/${total} answered)`);
  //     return;
  //   }
  //   dispatch(markSubmitted());
  //   toast.success('Quiz submitted!');
  // };

  const handleSubmit = async () => {
    if (answered < total) {
      toast.error(`Please answer all questions. (${answered}/${total} answered)`);
      return;
    }
    const correct = currentQuiz.questions.filter((q, i) => selectedAnswers[i]?.charAt(0) === q.answer).length;
    const timeTakenSeconds = Math.round((Date.now() - startTime) / 1000);

    dispatch(markSubmitted());
    const res = await dispatch(submitQuiz({ quizId: currentQuiz.quizId, score: correct, timeTakenSeconds }));
    if (submitQuiz.fulfilled.match(res)) {
      toast.success('Quiz submitted!');
    } else {
      toast.error(res.payload as string);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-semibold text-neutral-900 dark:text-white">{currentQuiz.topic}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={DIFF_VARIANTS[currentQuiz.difficulty]}>{currentQuiz.difficulty}</Badge>
              <span className="text-xs text-neutral-400">{answered}/{total} answered</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-neutral-400">Question</p>
            <p className="text-lg font-bold text-violet-600 dark:text-violet-400">{currentQuestionIndex + 1}<span className="text-sm font-normal text-neutral-400">/{total}</span></p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
          <div className="h-full bg-violet-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 mb-4 animate-slide-up">
        <p className="text-sm font-medium text-neutral-900 dark:text-white mb-4 leading-relaxed">{q.question}</p>
        <div className="space-y-2">
          {q.options.map((opt) => {
            const selected = selectedAnswers[currentQuestionIndex] === opt;
            return (
              <button
                key={opt}
                onClick={() => dispatch(selectAnswer({ index: currentQuestionIndex, answer: opt }))}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left text-sm transition-all ${selected
                  ? 'bg-violet-50 dark:bg-violet-950/40 border-violet-400 dark:border-violet-600 text-violet-800 dark:text-violet-300 font-medium'
                  : 'border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-violet-300 dark:hover:border-violet-700 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                  }`}
              >
                <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-semibold shrink-0 ${selected
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

      {/* Nav */}
      <div className="flex items-center justify-between">
        <Button
          variant="secondary"
          onClick={() => dispatch(prevQuestion())}
          disabled={currentQuestionIndex === 0}
        >
          <ChevronLeft className="w-4 h-4" /> Prev
        </Button>
        <div className="flex gap-1">
          {currentQuiz.questions.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === currentQuestionIndex ? 'bg-violet-600' : selectedAnswers[i] ? 'bg-violet-300 dark:bg-violet-700' : 'bg-neutral-200 dark:bg-neutral-700'
              }`} />
          ))}
        </div>
        {currentQuestionIndex < total - 1 ? (
          <Button onClick={() => dispatch(nextQuestion())}>
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit}>
            Submit <CheckCircle2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function QuizPage() {
  const dispatch = useAppDispatch();
  const { quizzes, currentQuiz, aiLoading } = useAppSelector((s) => s.quiz);
  const [showModal, setShowModal] = useState(false);

  // const handleGenerate = (syllabusId: string, num: number, diff: Difficulty) => {
  //   // Mock: simulate AI generating
  //   toast.loading('AI is generating your quiz...', { id: 'quiz-gen', duration: 2500 });
  //   setTimeout(() => {
  //     toast.dismiss('quiz-gen');
  //     const topic = mockTopics.find((t) => t.publicId === syllabusId)?.topic ?? 'General';
  //     const newQuiz: IQuiz = {
  //       ...mockQuizzes[2], // use system design mock as template
  //       publicId: `quiz-${Date.now()}`,
  //       topic,
  //       difficulty: diff,
  //       totalQuestions: num,
  //       questions: mockQuizzes[0].questions.slice(0, num),
  //       score: null,
  //       completedAt: null,
  //       createdAt: new Date().toISOString(),
  //     };
  //     dispatch(setCurrentQuiz(newQuiz));
  //     toast.success('Quiz ready!');
  //   }, 2500);
  // };

  const handleGenerate = async (syllabusId: string, num: number, diff: Difficulty) => {
    const res = await dispatch(generateQuiz({ syllabusId, numQuestions: num, difficulty: diff }));
    if (!generateQuiz.fulfilled.match(res)) {
      toast.error(res.payload as string);
    } else {
      toast.success('Quiz ready!');
    }
  };

  const handleOpenQuiz = async (quizId: string) => {
    const res = await dispatch(fetchQuizById(quizId));
    if (!fetchQuizById.fulfilled.match(res)) {
      toast.error(res.payload as string);
    }
  };

  useEffect(() => {
    dispatch(fetchAllQuizzes());
  }, [dispatch]);

  if (aiLoading) return <AppShell title="My Quizzes"><AILoader /></AppShell>;

  if (currentQuiz) {
    return (
      <AppShell title="My Quizzes">
        <div className="mb-4">
          <Button variant="ghost" size="sm" onClick={() => dispatch(clearCurrentQuiz())}>
            <ChevronLeft className="w-4 h-4" /> Back to quizzes
          </Button>
        </div>
        <ActiveQuiz />
      </AppShell>
    );
  }

  return (
    <AppShell title="My Quizzes">
      {showModal && <GenerateModal onClose={() => setShowModal(false)} onGenerate={handleGenerate} />}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {quizzes.filter((q) => q.score !== null).length} completed · {quizzes.length} total
          </p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4" /> Generate Quiz
        </Button>
      </div>

      {quizzes.length === 0 ? (
        <Empty
          icon={<FileQuestion className="w-10 h-10" />}
          title="No quizzes yet"
          description="Generate your first quiz from any topic in your library."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {quizzes.map((q) => {
            const pct = q.score !== null ? Math.round((q.score / q.totalQuestions) * 100) : null;
            const isComplete = q.score !== null;
            return (
              <div
                key={q.quizId}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 flex flex-col gap-3 hover:border-violet-300 dark:hover:border-violet-700 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">{q.topic}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={DIFF_VARIANTS[q.difficulty]}>{q.difficulty}</Badge>
                      <span className="text-xs text-neutral-400">{q.totalQuestions} questions</span>
                    </div>
                  </div>
                  {isComplete && (
                    <span className={`text-lg font-bold shrink-0 ${pct! >= 70 ? 'text-teal-600 dark:text-teal-400' : 'text-rose-500'}`}>
                      {pct}%
                    </span>
                  )}
                </div>

                {isComplete && (
                  <div>
                    <div className="h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${pct! >= 70 ? 'bg-teal-500' : 'bg-rose-500'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-neutral-400">{q.score}/{q.totalQuestions} correct</span>
                      {q.timeTakenSeconds && (
                        <span className="flex items-center gap-1 text-xs text-neutral-400">
                          <Clock className="w-3 h-3" />
                          {Math.floor(q.timeTakenSeconds / 60)}m {q.timeTakenSeconds % 60}s
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 mt-auto">
                  <Button
                    size="sm"
                    variant={isComplete ? 'secondary' : 'primary'}
                    className="flex-1"
                    onClick={() => handleOpenQuiz(q.quizId)}
                  >
                    {isComplete ? <><RotateCcw className="w-3.5 h-3.5" /> Retry</> : <><FileQuestion className="w-3.5 h-3.5" /> Start</>}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={async () => {
                      const res = await dispatch(deleteQuiz(q.quizId));
                      if (deleteQuiz.fulfilled.match(res)) {
                        toast.success('Quiz deleted');
                      } else {
                        toast.error(res.payload as string);
                      }
                    }}
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}

