//backend/src/repositories/bookmark.repository.ts
import mongoose from 'mongoose';
import BookmarkModel, { IBookmark } from '../models/bookmark.model';

// ─── Reads ────────────────────────────────────────────────────────────────────

export const findBookmarksByUserId = async (
    userId: string
): Promise<IBookmark[]> => {
    return BookmarkModel.find({ userId })
        .sort({ createdAt: -1 })
        .exec();
};

export const findBookmark = async (
    userId: string,
    syllabusId: string
): Promise<IBookmark | null> => {
    return BookmarkModel.findOne({ userId, syllabusId }).exec();
};

export const findBookmarkByBookmarkId = async (
    bookmarkId: string,
    userId: string | mongoose.Types.ObjectId
): Promise<IBookmark | null> => {
    return BookmarkModel.findOne({ bookmarkId, userId }).exec();
};

// ─── Writes ───────────────────────────────────────────────────────────────────

export const createBookmark = async (data: {
    userId: string;
    syllabusId: string;
    topic: string;
    note?: string;
}): Promise<IBookmark> => {
    return BookmarkModel.create(data);
};

export const deleteBookmarkByBookmarkId = async (
    bookmarkId: string,
    userId: string
): Promise<boolean> => {
    const result = await BookmarkModel.findOneAndDelete({ bookmarkId, userId }).exec();
    return !!result;
};

export const updateBookmarkNote = async (
    bookmarkId: string,
    userId: string,
    note: string
): Promise<IBookmark | null> => {
    return BookmarkModel.findOneAndUpdate(
        { bookmarkId, userId },
        { $set: { note } },
        { new: true }
    ).exec();
};