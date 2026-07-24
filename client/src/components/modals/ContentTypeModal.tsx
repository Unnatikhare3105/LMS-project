'use client';
import { Button } from '@/src/components/ui';
import { FileText, Video, Layers } from 'lucide-react';

type ContentChoice = 'text' | 'video' | 'both';

interface Props {
  onClose: () => void;
  onSelect: (choice: ContentChoice) => void;
}

export default function ContentTypeModal({ onClose, onSelect }: Props) {
  const options: { value: ContentChoice; label: string; icon: React.ReactNode; desc: string }[] = [
    { value: 'text', label: 'Text Explanation', icon: <FileText className="w-5 h-5" />, desc: 'Detailed written explanation only' },
    { value: 'video', label: 'Video Links', icon: <Video className="w-5 h-5" />, desc: 'Curated YouTube tutorials only' },
    { value: 'both', label: 'Both', icon: <Layers className="w-5 h-5" />, desc: 'Text + video, generated together' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 w-full max-w-sm animate-slide-up">
        <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-4">What do you want to generate?</h3>
        <div className="space-y-2 mb-4">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onSelect(opt.value); onClose(); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 text-left hover:border-violet-400 dark:hover:border-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950/20 transition-colors"
            >
              <span className="text-violet-600 dark:text-violet-400">{opt.icon}</span>
              <div>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">{opt.label}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">{opt.desc}</p>
              </div>
            </button>
          ))}
        </div>
        <Button variant="secondary" onClick={onClose} className="w-full">Cancel</Button>
      </div>
    </div>
  );
}