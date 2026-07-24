"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookmarkNote = exports.deleteBookmarkByBookmarkId = exports.createBookmark = exports.findBookmarkByBookmarkId = exports.findBookmark = exports.findBookmarksByUserId = void 0;
const bookmark_model_1 = __importDefault(require("../models/bookmark.model"));
// ─── Reads ────────────────────────────────────────────────────────────────────
const findBookmarksByUserId = async (userId) => {
    return bookmark_model_1.default.find({ userId })
        .sort({ createdAt: -1 })
        .exec();
};
exports.findBookmarksByUserId = findBookmarksByUserId;
const findBookmark = async (userId, syllabusId) => {
    return bookmark_model_1.default.findOne({ userId, syllabusId }).exec();
};
exports.findBookmark = findBookmark;
const findBookmarkByBookmarkId = async (bookmarkId, userId) => {
    return bookmark_model_1.default.findOne({ bookmarkId, userId }).exec();
};
exports.findBookmarkByBookmarkId = findBookmarkByBookmarkId;
// ─── Writes ───────────────────────────────────────────────────────────────────
const createBookmark = async (data) => {
    return bookmark_model_1.default.create(data);
};
exports.createBookmark = createBookmark;
const deleteBookmarkByBookmarkId = async (bookmarkId, userId) => {
    const result = await bookmark_model_1.default.findOneAndDelete({ bookmarkId, userId }).exec();
    return !!result;
};
exports.deleteBookmarkByBookmarkId = deleteBookmarkByBookmarkId;
const updateBookmarkNote = async (bookmarkId, userId, note) => {
    return bookmark_model_1.default.findOneAndUpdate({ bookmarkId, userId }, { $set: { note } }, { new: true }).exec();
};
exports.updateBookmarkNote = updateBookmarkNote;
//# sourceMappingURL=bookmark.repository.js.map