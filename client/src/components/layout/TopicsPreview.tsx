'use client';
import { useState, useEffect } from 'react';
import AppShell from '@/src/components/layout/AppShell';
import { Badge, Button, Empty } from '@/src/components/ui';
import { useAppSelector } from '@/src/hooks/useAppSelector';
import { useAppDispatch } from '@/src/hooks/useAppDispatch';
import { useRouter } from 'next/navigation';
import { fetchAllTopicsThunk, deleteSyllabusThunk } from '@/src/store/thunks/syllabus.thunk';
import { setCurrentSyllabus } from '@/src/store/slices/syllabusSlice';
import { ISyllabus } from '@/src/types';
import { History, Search, FileText, Video, Layers, Trash2, ChevronRight, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { Input } from '../ui/Badge';
import TopicDetailModal from '../modals/TopicDetailsModal';

const TYPE_CONFIG = {
    text: { icon: FileText, color: 'text-violet-500', bg: 'bg-violet-100 dark:bg-violet-950/50', badge: 'violet' as const },
    video: { icon: Video, color: 'text-teal-500', bg: 'bg-teal-100 dark:bg-teal-950/50', badge: 'teal' as const },
    both: { icon: Layers, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-950/50', badge: 'amber' as const },
};

function HistoryCard({ topic, onOpen, onDelete }: { topic: ISyllabus; onOpen: () => void; onDelete: () => void }) {
    const config = TYPE_CONFIG[topic.contentType as keyof typeof TYPE_CONFIG] ?? TYPE_CONFIG.text;
    const Icon = config.icon;
    

    return (
        <div
            onClick={onOpen}
            className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 flex items-start gap-3 hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-sm transition-all cursor-pointer"
        >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${config.bg}`}>
                <Icon className={`w-4.5 h-4.5 ${config.color}`} />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">{topic.topic}</p>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(); }}
                        className="p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-neutral-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>

                {topic.content && (
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 mt-1 leading-relaxed">
                        {topic.content.replace(/#+\s/g, '').replace(/\*\*/g, '').slice(0, 100)}...
                    </p>
                )}

                <div className="flex items-center gap-2 mt-2.5">
                    <Badge variant={config.badge}>{topic.contentType}</Badge>
                    {topic.videoLinks?.length > 0 && (
                        <span className="text-xs text-neutral-400">{topic.videoLinks.length} videos</span>
                    )}
                    <span className="flex items-center gap-1 text-xs text-neutral-400 ml-auto">
                        <Clock className="w-3 h-3" />
                        {new Date(topic.createdAt).toLocaleDateString()}
                    </span>
                </div>
            </div>

            <ChevronRight className="w-4 h-4 text-neutral-300 dark:text-neutral-700 group-hover:text-violet-400 transition-colors shrink-0 mt-1" />
        </div>
    );
}

export default function HistoryPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const topics = useAppSelector((s) => s.syllabus.topics);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<'all' | 'text' | 'video' | 'both'>('all');
    const [viewingTopic, setViewingTopic] = useState<ISyllabus | null>(null);

    const handleOpen = (topic: ISyllabus) => {
        setViewingTopic(topic);
    };

    useEffect(() => {
        dispatch(fetchAllTopicsThunk());
    }, [dispatch]);

    const filtered = topics.filter((t) => {
        const matchSearch = t.topic.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === 'all' || t.contentType === filter;
        return matchSearch && matchFilter;
    });

    const grouped = filtered.reduce((acc: Record<string, ISyllabus[]>, t) => {
        const date = new Date(t.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
        if (!acc[date]) acc[date] = [];
        acc[date].push(t);
        return acc;
    }, {});

    // const handleOpen = (topic: ISyllabus) => {
    //     dispatch(setCurrentSyllabus(topic));
    //     router.push('/search');
    // };

    const handleDelete = async (syllabusId: string) => {
        const res = await dispatch(deleteSyllabusThunk(syllabusId));
        if (deleteSyllabusThunk.fulfilled.match(res)) {
            toast.success('Removed from history.');
        } else {
            toast.error(res.payload as string);
        }
    };

    return (
        <AppShell title="History">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-11 h-11 rounded-2xl bg-violet-100 dark:bg-violet-950/50 flex items-center justify-center shrink-0">
                        <History className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                        <h2 className="text-base font-semibold text-neutral-900 dark:text-white">Your Search History</h2>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">{topics.length} topics explored so far</p>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <Input
                        value={search}
                        onChange={setSearch}
                        placeholder="Search your history..."
                        icon={<Search className="w-4 h-4" />}
                        className="flex-1"
                    />
                    <div className="flex bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1 gap-1">
                        {(['all', 'text', 'video', 'both'] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-all ${filter === f
                                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
                                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* List */}
                {filtered.length === 0 ? (
                    <Empty
                        icon={<History className="w-10 h-10" />}
                        title={search ? `No results for "${search}"` : 'No history yet'}
                        description={search ? 'Try a different search term.' : 'Topics you search will show up here.'}
                    />
                ) : (
                    <div className="space-y-6">
                        {Object.entries(grouped).map(([date, items]) => (
                            <div key={date}>
                                <p className="text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wide mb-3">{date}</p>
                                <div className="space-y-2.5">
                                    {items.map((t) => (
                                        <HistoryCard
                                            key={t.syllabusId}
                                            topic={t}
                                            onOpen={() => handleOpen(t)}
                                            onDelete={() => handleDelete(t.syllabusId)}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {viewingTopic && (
                    <TopicDetailModal
                        topic={viewingTopic}
                        onClose={() => setViewingTopic(null)}
                    />
                )}
            </div>

        </AppShell>
    );
}