'use client';
import { useState, useEffect } from 'react';
import AppShell from '@/src/components/layout/AppShell';
import { Button, Badge, AILoader, Empty } from '@/src/components/ui';
import { useAppSelector } from '@/src/hooks/useAppSelector';
import { useAppDispatch } from '@/src/hooks/useAppDispatch';
import { Difficulty, ISyllabus } from '@/src/types';
import { generateTextContentThunk, generateVideoContentThunk, fetchAllTopicsThunk, generateFullContentThunk } from '@/src/store/thunks/syllabus.thunk';
import { addBookmark, removeBookmark, fetchAllBookmarks } from '@/src/store/thunks/bookmark.thunk';
import { generateQuiz } from '@/src/store/thunks/quiz.thunk';
import {
  Search, FileText, Video, Bookmark, BookmarkCheck,
  PlayCircle, Sparkles, Clock, ChevronRight, X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Input } from '../ui/Badge';
import { useRouter } from 'next/navigation';
import GenerateModal from '../modals/GenerateModal';
import ContentTypeModal from '../modals/ContentTypeModal';


// Simple markdown renderer
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

export default function SearchPage() {
  const dispatch = useAppDispatch();
  const { topics, currentSyllabus, aiLoading } = useAppSelector((s) => s.syllabus);
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'text' | 'video'>('text');
  const [selected, setSelected] = useState<ISyllabus | null>(null);
  const [searching, setSearching] = useState(false);
  const router = useRouter();
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const { bookmarks } = useAppSelector((s) => s.bookmark);

  useEffect(() => {
    dispatch(fetchAllTopicsThunk());
    dispatch(fetchAllBookmarks());
  }, [dispatch]);

  const handleSearch = async () => {
    if (!query.trim()) { toast.error('Enter a topic to search.'); return; }

    setSearching(true);
    const res = await dispatch(generateFullContentThunk(query.trim()));
    setSearching(false);

    if (generateFullContentThunk.fulfilled.match(res)) {
      setSelected(res.payload.data);
      toast.success('Content generated!');
    } else {
      toast.error(res.payload as string || 'Failed to generate content.');
    }
  };

  const handleGenerateClick = () => {
    if (!query.trim()) { toast.error('Enter a topic to search.'); return; }
    setShowTypeModal(true);
  };

  const handleGenerateByType = async (choice: 'text' | 'video' | 'both') => {
    setSearching(true);

    const thunk = choice === 'text' ? generateTextContentThunk : choice === 'video' ? generateVideoContentThunk : generateFullContentThunk;
    const res = await dispatch(thunk(query.trim()));

    setSearching(false);

    if (thunk.fulfilled.match(res)) {
      setSelected(res.payload.data);
      toast.success('Content generated!');
    } else {
      toast.error(res.payload as string || 'Failed to generate content.');
    }
  };



  const toggleBookmark = async (syllabusId: string) => {
    const existing = bookmarks.find((b) => b.syllabusId === syllabusId);
    if (existing) {
      await dispatch(removeBookmark(existing.bookmarkId));
      toast('Bookmark removed');
    } else {
      await dispatch(addBookmark({ syllabusId }));
      toast.success('Bookmarked!');
    }
  };

  const handleTakeQuiz = () => {
    setShowQuizModal(true);
  };

  const handleGenerateQuiz = async (syllabusId: string, num: number, diff: Difficulty) => {
    const res = await dispatch(generateQuiz({ syllabusId, numQuestions: num, difficulty: diff }));
    if (generateQuiz.fulfilled.match(res)) {
      toast.success('Quiz ready!');
      router.push('/quiz');
    } else {
      toast.error(res.payload as string || 'Failed to generate quiz.');
    }
  };


  const displaySyllabus = selected || currentSyllabus;

  return (
    <AppShell title="Search">
      <div className="max-w-6xl mx-auto">
        {/* Search bar */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 mb-6">
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">Search any topic</h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
            AI will generate a detailed explanation and find relevant videos.
          </p>
          <div className="flex gap-2">
            <Input
              value={query}
              onChange={setQuery}
              placeholder="e.g. React Hooks, Binary Trees, SQL Joins..."
              icon={<Search className="w-4 h-4" />}
              className="flex-1"
            />
            <Button onClick={handleGenerateClick} loading={searching} size="lg">
              <Sparkles className="w-4 h-4" />
              Generate
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: topic list */}
          <div>
            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2 uppercase tracking-wide">
              Your library ({topics.length})
            </p>
            <div className="space-y-1">
              {topics.map((t) => (
                <button
                  key={t.syllabusId}
                  onClick={() => setSelected(t)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors text-sm group ${selected?.syllabusId === t.syllabusId
                    ? 'bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400'
                    : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                    }`}
                >
                  {t.contentType === 'video'
                    ? <Video className="w-3.5 h-3.5 shrink-0 text-teal-500" />
                    : <FileText className="w-3.5 h-3.5 shrink-0 text-violet-500" />}
                  <span className="truncate flex-1">{t.topic}</span>
                  <ChevronRight className="w-3 h-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
              {topics.length === 0 && (
                <Empty icon={<BookmarkCheck className="w-8 h-8" />} title="No topics yet" description="Search a topic above to get started." />
              )}
            </div>
          </div>

          {/* Right: content area */}
          <div className="lg:col-span-2">
            {searching || aiLoading ? (
              <AILoader />
            ) : displaySyllabus ? (
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 dark:border-neutral-800">
                  <div>
                    <h2 className="text-base font-semibold text-neutral-900 dark:text-white">{displaySyllabus.topic}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={displaySyllabus.contentType === 'text' ? 'violet' : 'teal'}>{displaySyllabus.contentType}</Badge>
                      <span className="flex items-center gap-1 text-xs text-neutral-400">
                        <Clock className="w-3 h-3" />
                        {new Date(displaySyllabus.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleBookmark(displaySyllabus.syllabusId)}
                      className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      title="Bookmark"
                    >
                  
                      {bookmarks.some((b) => b.syllabusId === displaySyllabus.syllabusId)
                        ? <BookmarkCheck className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                        : <Bookmark className="w-4 h-4 text-neutral-400" />}

                    </button>
                    <Button size="sm" onClick={handleTakeQuiz}>
                      Take Quiz →
                    </Button>
                    <button onClick={() => setSelected(null)} className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-neutral-200 dark:border-neutral-800">
                  <button
                    onClick={() => setActiveTab('text')}
                    className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === 'text'
                      ? 'border-violet-600 text-violet-600 dark:text-violet-400'
                      : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                      }`}
                  >
                    <FileText className="w-3.5 h-3.5" /> Explanation
                  </button>
                  <button
                    onClick={() => setActiveTab('video')}
                    className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === 'video'
                      ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                      : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                      }`}
                  >
                    <Video className="w-3.5 h-3.5" /> Videos ({displaySyllabus.videoLinks?.length ?? 0})
                  </button>
                </div>

                {/* Content */}
                <div className="p-5 max-h-[520px] overflow-y-auto">
                  {activeTab === 'text' ? (
                    displaySyllabus.content ? (
                      <MarkdownContent content={displaySyllabus.content} />
                    ) : (
                      <Empty icon={<FileText className="w-8 h-8" />} title="No text content" description="Generate text content for this topic." />
                    )
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {displaySyllabus.videoLinks?.length ? (
                        displaySyllabus.videoLinks.map((v) => (
                          <a
                            key={v.videoId}
                            href={v.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden hover:border-teal-400 dark:hover:border-teal-600 transition-colors"
                          >
                            <div className="relative">
                              <img src={v.thumbnail} alt={v.title} className="w-full h-32 object-cover" />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors">
                                <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center">
                                  <PlayCircle className="w-6 h-6 text-teal-600" />
                                </div>
                              </div>
                            </div>
                            <div className="p-3">
                              <p className="text-xs font-medium text-neutral-800 dark:text-neutral-200 line-clamp-2 leading-relaxed group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                                {v.title}
                              </p>
                            </div>
                          </a>
                        ))
                      ) : (
                        <div className="col-span-2">
                          <Empty icon={<Video className="w-8 h-8" />} title="No videos yet" description="Videos will appear here when generated." />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-80 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl gap-3">
                <Search className="w-10 h-10 text-neutral-300 dark:text-neutral-700" />
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Search a topic to get started</p>
                <p className="text-xs text-neutral-400 dark:text-neutral-500">Or select one from your library on the left</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {showTypeModal && (
        <ContentTypeModal
          onClose={() => setShowTypeModal(false)}
          onSelect={handleGenerateByType}
        />
      )}
      {showQuizModal && displaySyllabus && (
        <GenerateModal
          onClose={() => setShowQuizModal(false)}
          onGenerate={handleGenerateQuiz}
          fixedSyllabusId={displaySyllabus.syllabusId}
        />
      )}
    </AppShell>
  );
}

