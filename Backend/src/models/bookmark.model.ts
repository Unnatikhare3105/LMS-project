//backend/src/models/bookmark.model.ts

import mongoose, { Document, Model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface IBookmark extends Document {
    bookmarkId: string;
    userId: string;
    syllabusId: string;
    topic: string;
    note: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IBookmarkModel extends Model<IBookmark> { }

// ─── Schema ───────────────────────────────────────────────────────────────────

const bookmarkSchema = new Schema<IBookmark, IBookmarkModel>(
    {
        bookmarkId: {
            type: String,
            default: () => uuidv4(),
            unique: true,
            index: true,
        },
        userId: {
            type: String,
            ref: 'User',
            required: true
        },
        syllabusId: {
            type: String,
            ref: 'Syllabus',
            required: true
        },

        topic: {
            type: String,
            required: true,
            trim: true
        },

        note: {
            type: String,
            default: ''
        },

    },
    { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

bookmarkSchema.index({ userId: 1 });
bookmarkSchema.index({ userId: 1, syllabusId: 1 }, { unique: true }); // one bookmark per topic per user
bookmarkSchema.index({ createdAt: -1 });

// ─── Export ───────────────────────────────────────────────────────────────────

const BookmarkModel = mongoose.model<IBookmark, IBookmarkModel>('Bookmark', bookmarkSchema);
export default BookmarkModel;