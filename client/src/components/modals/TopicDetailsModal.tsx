"use client";
import { useState, useEffect } from 'react';
import { Badge, Button } from '@/src/components/ui';
import { ISyllabus } from '@/src/types';
import { FileText, Video, X, PlayCircle, Clock } from 'lucide-react';
import { useAppDispatch } from '@/src/hooks/useAppDispatch';
import { fetchSyllabusByIdThunk } from '@/src/store/thunks/syllabus.thunk';

// Reuse same markdown renderer pattern from SearchPage
function MarkdownContent({ content }: { content: string }) {
  const html = content
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>[\s\S]+?<\/li>)/g, '<ul>$&</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hpuol])/gm, '<p>')
    .replace(/```[\s\S]+?```/g, (m) => `<pre>${m.replace(/```\w*\n?/g, '')}</pre>`);
  return <div className="prose-content" dangerouslySetInnerHTML={{ __html: html }} />;
}

interface Props {
  topic: ISyllabus;
  onClose: () => void;
}

export default function TopicDetailModal({ topic, onClose }: Props) {
  const dispatch = useAppDispatch();
  const [fullTopic, setFullTopic] = useState<ISyllabus>(topic);
  const [activeTab, setActiveTab] = useState<'text' | 'video'>(
    topic.content ? 'text' : 'video'
  );

  useEffect(() => {
    let mounted = true;
    // If topic already has content or videos, use it. Otherwise fetch full data.
    if (!topic.content || (!topic.videoLinks || topic.videoLinks.length === 0)) {
      (async () => {
        const res = await dispatch(fetchSyllabusByIdThunk(topic.syllabusId));
        if (fetchSyllabusByIdThunk.fulfilled.match(res) && mounted) {
          setFullTopic(res.payload.data);
          if (res.payload.data.content) setActiveTab('text');
        }
      })();
    } else {
      setFullTopic(topic);
    }
    return () => { mounted = false; };
  }, [topic, dispatch]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col animate-slide-up overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
          <div>
            <h2 className="text-base font-semibold text-neutral-900 dark:text-white">{topic.topic}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={topic.contentType === 'video' ? 'teal' : topic.contentType === 'both' ? 'amber' : 'violet'}>
                {topic.contentType}
              </Badge>
              <span className="flex items-center gap-1 text-xs text-neutral-400">
                <Clock className="w-3 h-3" />
                {new Date(topic.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-neutral-200 dark:border-neutral-800 shrink-0">
          <button
            onClick={() => setActiveTab('text')}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'text'
                ? 'border-violet-600 text-violet-600 dark:text-violet-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Explanation
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'video'
                ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            <Video className="w-3.5 h-3.5" /> Videos ({topic.videoLinks?.length ?? 0})
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1">
          {activeTab === 'text' ? (
            fullTopic.content ? (
              <MarkdownContent content={fullTopic.content} />
            ) : (
              <p className="text-sm text-neutral-400 text-center py-8">No text content for this topic.</p>
            )
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {fullTopic.videoLinks?.length ? (
                fullTopic.videoLinks.map((v) => (
                  <a
                    key={v.videoId}
                    href={v.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden hover:border-teal-400 dark:hover:border-teal-600 transition-colors"
                  >
                    <div className="relative">
                      <img src={v.thumbnail} alt={v.title} className="w-full h-28 object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors">
                        <div className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center">
                          <PlayCircle className="w-5 h-5 text-teal-600" />
                        </div>
                      </div>
                    </div>
                    <div className="p-2.5">
                      <p className="text-xs font-medium text-neutral-800 dark:text-neutral-200 line-clamp-2 leading-relaxed group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                        {v.title}
                      </p>
                    </div>
                  </a>
                ))
              ) : (
                <p className="col-span-2 text-sm text-neutral-400 text-center py-8">No videos for this topic.</p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-neutral-200 dark:border-neutral-800 shrink-0">
          <Button variant="secondary" onClick={onClose} className="w-full">Close</Button>
        </div>
      </div>
    </div>
  );
}