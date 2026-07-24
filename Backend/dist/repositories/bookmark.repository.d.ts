import mongoose from 'mongoose';
import { IBookmark } from '../models/bookmark.model';
export declare const findBookmarksByUserId: (userId: string) => Promise<IBookmark[]>;
export declare const findBookmark: (userId: string, syllabusId: string) => Promise<IBookmark | null>;
export declare const findBookmarkByBookmarkId: (bookmarkId: string, userId: string | mongoose.Types.ObjectId) => Promise<IBookmark | null>;
export declare const createBookmark: (data: {
    userId: string;
    syllabusId: string;
    topic: string;
    note?: string;
}) => Promise<IBookmark>;
export declare const deleteBookmarkByBookmarkId: (bookmarkId: string, userId: string) => Promise<boolean>;
export declare const updateBookmarkNote: (bookmarkId: string, userId: string, note: string) => Promise<IBookmark | null>;
//# sourceMappingURL=bookmark.repository.d.ts.map