'use client';
import { useState } from 'react';
import { useAppSelector } from '@/src/hooks/useAppSelector';
import { Button } from '@/src/components/ui';
import { Difficulty } from '@/src/types';
import { QUIZ_NUM_OPTIONS } from '@/src/constants';

interface GenerateModalProps {
  onClose: () => void;
  onGenerate: (syllabusId: string, num: number, diff: Difficulty) => void;
  fixedSyllabusId?: string; // agar diya hai toh topic dropdown hide ho jayega
}

export default function GenerateModal({ onClose, onGenerate, fixedSyllabusId }: GenerateModalProps) {
  const topics = useAppSelector((s) => s.syllabus.topics);
  const [syllabusId, setSyllabusId] = useState(fixedSyllabusId ?? topics[0]?.syllabusId ?? '');
  const [num, setNum] = useState(5);
  const [diff, setDiff] = useState<Difficulty>('intermediate');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 w-full max-w-sm animate-slide-up">
        <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-4">Generate Quiz</h3>

        <div className="space-y-4">
          {!fixedSyllabusId && (
            <div>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">Topic</label>
              <select
                value={syllabusId}
                onChange={(e) => setSyllabusId(e.target.value)}
                className="w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/30"
              >
                {topics.map((t) => <option key={t.syllabusId} value={t.syllabusId}>{t.topic}</option>)}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">Difficulty</label>
            <div className="flex gap-2">
              {(['beginner', 'intermediate', 'advanced'] as Difficulty[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setDiff(d)}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-lg border transition-colors capitalize ${
                    diff === d
                      ? 'bg-violet-600 border-violet-600 text-white'
                      : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-violet-400'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">Number of Questions</label>
            <div className="flex gap-2 flex-wrap">
              {QUIZ_NUM_OPTIONS.map((n) => (
                <button
                  key={n}
                  onClick={() => setNum(n)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                    num === n
                      ? 'bg-violet-600 border-violet-600 text-white'
                      : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-violet-400'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button
            onClick={() => { onGenerate(syllabusId, num, diff); onClose(); }}
            className="flex-1"
            disabled={!syllabusId}
          >
            Generate
          </Button>
        </div>
      </div>
    </div>
  );
}