'use client';
import { useEffect, useState } from 'react';
import AppShell from '@/src/components/layout/AppShell';
import { Badge, Button, Empty } from '@/src/components/ui';
import { useAppSelector } from '@/src/hooks/useAppSelector';
import { useAppDispatch } from '@/src/hooks/useAppDispatch';
import { IBookmark } from '@/src/types';
import { Bookmark, Search, Trash2, Pencil, Check, X, FileText, Video, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { Input } from '../ui/Badge';
import { fetchAllBookmarks, removeBookmark, updateBookmarkNote } from '@/src/store/thunks/bookmark.thunk';

function BookmarkCard({
  bm,
  onDelete,
  onUpdateNote,
}: {
  bm: IBookmark;
  onDelete: (id: string) => void;
  onUpdateNote: (id: string, note: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [note, setNote] = useState(bm.note);

  const save = () => {
    onUpdateNote(bm.bookmarkId, note);
    setEditing(false);
    toast.success('Note updated!');
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 flex flex-col gap-3 hover:border-violet-300 dark:hover:border-violet-700 transition-colors">
      {/* Topic row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className={`w-2 h-2 rounded-full shrink-0 ${bm.contentType === 'video' ? 'bg-teal-500' : 'bg-violet-500'}`} />
          <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">{bm.topic}</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Badge variant={bm.contentType === 'video' ? 'teal' : 'violet'}>
            {bm.contentType === 'video' ? <Video className="w-3 h-3 inline mr-1" /> : <FileText className="w-3 h-3 inline mr-1" />}
            {bm.contentType}
          </Badge>
        </div>
      </div>

      {/* Note */}
      <div className="flex-1">
        {editing ? (
          <div className="flex items-center gap-2">
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && save()}
              className="flex-1 bg-neutral-50 dark:bg-neutral-800 border border-violet-300 dark:border-violet-700 rounded-lg px-3 py-1.5 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/30"
              autoFocus
              placeholder="Add a note..."
            />
            <button onClick={save} className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-600 hover:bg-teal-100 transition-colors">
              <Check className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => { setEditing(false); setNote(bm.note); }} className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:bg-neutral-200 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => setEditing(true)}
            className="group flex items-start gap-2 cursor-pointer"
          >
            <p className="text-xs text-neutral-500 dark:text-neutral-400 flex-1 leading-relaxed">
              {note || <span className="italic text-neutral-300 dark:text-neutral-600">Add a note...</span>}
            </p>
            <Pencil className="w-3 h-3 text-neutral-300 dark:text-neutral-600 group-hover:text-violet-400 transition-colors shrink-0 mt-0.5" />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1 text-xs text-neutral-400">
          <Clock className="w-3 h-3" />
          {new Date(bm.createdAt).toLocaleDateString()}
        </span>
        <button
          onClick={() => onDelete(bm.bookmarkId)}
          className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-neutral-400 hover:text-rose-500 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default function BookmarksPage() {
  const dispatch = useAppDispatch();
  const { bookmarks } = useAppSelector((s) => s.bookmark);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'text' | 'video'>('all');

  useEffect(() => {
    dispatch(fetchAllBookmarks());
  }, [dispatch]);

  const filtered = bookmarks.filter((b) => {
    const matchSearch = b.topic.toLowerCase().includes(search.toLowerCase()) || b.note.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || b.contentType === filter;
    return matchSearch && matchFilter;
  });

  const handleDelete = async (id: string) => {
    const res = await dispatch(removeBookmark(id));
    if (removeBookmark.fulfilled.match(res)) {
      toast.success('Bookmark removed.');
    } else {
      toast.error(res.payload as string);
    }
  };

  const handleUpdateNote = async (id: string, note: string) => {
    const res = await dispatch(updateBookmarkNote({ bookmarkId: id, note }));
    if (!updateBookmarkNote.fulfilled.match(res)) {
      toast.error(res.payload as string);
    }
  };
  

  // const filtered = localBookmarks.filter((b) => {
  //   const matchSearch = b.topic.toLowerCase().includes(search.toLowerCase()) || b.note.toLowerCase().includes(search.toLowerCase());
  //   const matchFilter = filter === 'all' || b.contentType === filter;
  //   return matchSearch && matchFilter;
  // });

  // const handleDelete = (id: string) => {
  //   setLocalBookmarks((prev) => prev.filter((b) => b.bookmarkId !== id));
  //   toast.success('Bookmark removed.');
  // };

  // const handleUpdateNote = (id: string, note: string) => {
  //   setLocalBookmarks((prev) => prev.map((b) => b.bookmarkId === id ? { ...b, note } : b));
  // };

  return (
    <AppShell title="Bookmarks">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Input
          value={search}
          onChange={setSearch}
          placeholder="Search bookmarks..."
          icon={<Search className="w-4 h-4" />}
          className="flex-1"
        />
        <div className="flex bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1 gap-1">
          {(['all', 'text', 'video'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-all ${
                filter === f
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-4 mb-5 text-xs text-neutral-500 dark:text-neutral-400">
        <span>{bookmarks.length} total bookmarks</span>
        <span>·</span>
        <span>{bookmarks.filter((b) => b.contentType === 'text').length} text</span>
        <span>·</span>
        <span>{bookmarks.filter((b) => b.contentType === 'video').length} video</span>
        {search && <><span>·</span><span>{filtered.length} results for "{search}"</span></>}
      </div>

      {filtered.length === 0 ? (
        <Empty
          icon={<Bookmark className="w-10 h-10" />}
          title={search ? `No bookmarks match "${search}"` : 'No bookmarks yet'}
          description={search ? 'Try a different search.' : 'Bookmark topics from the Search page.'}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((bm) => (
            <BookmarkCard key={bm.bookmarkId} bm={bm} onDelete={handleDelete} onUpdateNote={handleUpdateNote} />
          ))}
        </div>
      )}
    </AppShell>
  );
}