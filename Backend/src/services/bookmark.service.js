"use strict";
//backend/src/services/bookmark.service.ts
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
exports.updateNote = exports.removeBookmark = exports.getBookmarks = exports.addBookmark = void 0;
const customError_1 = __importDefault(require("../utils/customError"));
const bookmarkRepo = __importStar(require("../repositories/bookmark.repository"));
const syllabusRepo = __importStar(require("../repositories/syllabus.repository"));
const addBookmark = async (userId, syllabusPublicId, note) => {
    const syllabus = await syllabusRepo.findSyllabusBySyllabusId(syllabusPublicId);
    if (!syllabus)
        throw new customError_1.default('Topic not found.', 404);
    const existing = await bookmarkRepo.findBookmark(userId, syllabusPublicId);
    if (existing)
        throw new customError_1.default('Already bookmarked.', 409);
    return bookmarkRepo.createBookmark({
        userId,
        syllabusId: syllabusPublicId,
        topic: syllabus.topic,
        note,
    });
};
exports.addBookmark = addBookmark;
const getBookmarks = async (userId) => {
    return bookmarkRepo.findBookmarksByUserId(userId);
};
exports.getBookmarks = getBookmarks;
const removeBookmark = async (publicId, userId) => {
    const deleted = await bookmarkRepo.deleteBookmarkByBookmarkId(publicId, userId);
    if (!deleted)
        throw new customError_1.default('Bookmark not found.', 404);
};
exports.removeBookmark = removeBookmark;
const updateNote = async (publicId, userId, note) => {
    const updated = await bookmarkRepo.updateBookmarkNote(publicId, userId, note);
    if (!updated)
        throw new customError_1.default('Bookmark not found.', 404);
    return updated;
};
exports.updateNote = updateNote;
//# sourceMappingURL=bookmark.service.js.map