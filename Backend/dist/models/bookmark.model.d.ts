import { Document, Model } from 'mongoose';
export interface IBookmark extends Document {
    bookmarkId: string;
    userId: string;
    syllabusId: string;
    topic: string;
    note: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface IBookmarkModel extends Model<IBookmark> {
}
declare const BookmarkModel: IBookmarkModel;
export default BookmarkModel;
//# sourceMappingURL=bookmark.model.d.ts.map