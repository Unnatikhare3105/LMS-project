"use strict";
//backend/src/controllers/bookmark.controller.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeBookmarkController = exports.updateBookmarkNoteController = exports.getBookmarksController = exports.addBookmarkController = void 0;
const customError_1 = __importDefault(require("../utils/customError"));
const bookmarkService = __importStar(require("../services/bookmark.service"));
const addBookmarkController = async (req, res, next) => {
    try {
        const { syllabusId } = req.params; // UUID
        const { note } = req.body;
        if (!syllabusId)
            return next(new customError_1.default('Syllabus ID is required.', 400));
        const bookmark = await bookmarkService.addBookmark(req.user._id.toString(), syllabusId, note);
        res.status(201).json({
            success: true,
            message: 'Bookmarked successfully.',
            data: {
                bookmarkId: bookmark.bookmarkId,
                topic: bookmark.topic,
                note: bookmark.note,
                createdAt: bookmark.createdAt,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.addBookmarkController = addBookmarkController;
const getBookmarksController = async (req, res, next) => {
    try {
        const bookmarks = await bookmarkService.getBookmarks(req.user._id.toString());
        res.status(200).json({ success: true, data: bookmarks });
    }
    catch (error) {
        next(error);
    }
};
exports.getBookmarksController = getBookmarksController;
const updateBookmarkNoteController = async (req, res, next) => {
    try {
        const { bookmarkId } = req.params; // UUID
        const { note } = req.body;
        if (!bookmarkId)
            return next(new customError_1.default('Bookmark ID is required.', 400));
        if (note === undefined)
            return next(new customError_1.default('Note is required.', 400));
        const updated = await bookmarkService.updateNote(bookmarkId, req.user._id.toString(), note);
        res.status(200).json({ success: true, message: 'Note updated.', data: updated });
    }
    catch (error) {
        next(error);
    }
};
exports.updateBookmarkNoteController = updateBookmarkNoteController;
const removeBookmarkController = async (req, res, next) => {
    try {
        const { bookmarkId } = req.params; // UUID
        if (!bookmarkId)
            return next(new customError_1.default('Bookmark ID is required.', 400));
        await bookmarkService.removeBookmark(bookmarkId, req.user._id.toString());
        res.status(200).json({ success: true, message: 'Bookmark removed.' });
    }
    catch (error) {
        next(error);
    }
};
exports.removeBookmarkController = removeBookmarkController;
//# sourceMappingURL=bookmark.controller.js.map