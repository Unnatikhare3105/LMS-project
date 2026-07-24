import { IBookmark } from '../models/bookmark.model';
export declare const addBookmark: (userId: string, syllabusPublicId: string, note?: string) => Promise<IBookmark>;
export declare const getBookmarks: (userId: string) => Promise<IBookmark[]>;
export declare const removeBookmark: (publicId: string, userId: string) => Promise<void>;
export declare const updateNote: (publicId: string, userId: string, note: string) => Promise<IBookmark>;
//# sourceMappingURL=bookmark.service.d.ts.map