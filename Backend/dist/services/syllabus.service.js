"use strict";
//Backend/src/services/syllabus.service.ts
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
exports.deleteSyllabus = exports.updateSyllabusContent = exports.getSyllabusByPublicId = exports.getAllTopics = exports.generateContentAsVideo = exports.generateContentAsText = void 0;
const customError_1 = __importDefault(require("../utils/customError"));
const syllabusRepo = __importStar(require("../repositories/syllabus.repository"));
const userRepo = __importStar(require("../repositories/user.repository"));
const aiService = __importStar(require("./ai.service"));
// ─── Generate text content ────────────────────────────────────────────────────
const generateContentAsText = async ({ topic, userId, }) => {
    // Return cached version if already generated for this user + topic
    const existing = await syllabusRepo.findSyllabusByUserAndTopic(userId, topic);
    if (existing && existing.content)
        return existing;
    const content = await aiService.getDetailedExplanation(topic);
    if (!content)
        throw new customError_1.default('AI returned no content.', 500);
    const syllabus = await syllabusRepo.createTextSyllabus({ userId, topic, content });
    // Fire and forget – non-blocking activity tracking
    userRepo.recordActivity(userId).catch(() => { });
    userRepo.incrementTopicCount(userId).catch(() => { });
    return syllabus;
};
exports.generateContentAsText = generateContentAsText;
// ─── Generate video content ───────────────────────────────────────────────────
const generateContentAsVideo = async ({ topic, userId, }) => {
    const [videos, references] = await Promise.all([
        aiService.getVideoLinks(topic),
        aiService.getReferenceLinks(topic),
    ]);
    if (!videos || videos.length === 0) {
        throw new customError_1.default('No videos found for this topic.', 404);
    }
    const syllabus = await syllabusRepo.createVideoSyllabus({
        userId,
        topic,
        videoLinks: videos,
        referenceLinks: references,
    });
    // export const generateContentAsVideo = async ({
    //   topic,
    //   userId,
    // }: {
    //   topic: string;
    //   userId: string;
    // }): Promise<ISyllabus> => {
    //   const videos = await aiService.getVideoLinks(topic);
    //   if (!videos || videos.length === 0) {
    //     throw new CustomError('No videos found for this topic.', 404);
    //   }
    //   const syllabus = await syllabusRepo.createVideoSyllabus({
    //     userId,
    //     topic,
    //     videoLinks: videos,
    //   });
    userRepo.recordActivity(userId).catch(() => { });
    userRepo.incrementTopicCount(userId).catch(() => { });
    return syllabus;
};
exports.generateContentAsVideo = generateContentAsVideo;
// ─── Reads ────────────────────────────────────────────────────────────────────
const getAllTopics = async (userId) => {
    const topics = await syllabusRepo.findSyllabusByUserId(userId);
    if (!topics.length)
        throw new customError_1.default('No topics found.', 404);
    return topics;
};
exports.getAllTopics = getAllTopics;
const getSyllabusByPublicId = async (publicId) => {
    const syllabus = await syllabusRepo.findSyllabusBySyllabusId(publicId);
    if (!syllabus)
        throw new customError_1.default('Syllabus not found.', 404);
    return syllabus;
};
exports.getSyllabusByPublicId = getSyllabusByPublicId;
// ─── Mutations ────────────────────────────────────────────────────────────────
const updateSyllabusContent = async (publicId, content) => {
    const updated = await syllabusRepo.updateSyllabusContent(publicId, content);
    if (!updated)
        throw new customError_1.default('Syllabus not found or update failed.', 404);
    return updated;
};
exports.updateSyllabusContent = updateSyllabusContent;
const deleteSyllabus = async (publicId) => {
    const deleted = await syllabusRepo.deleteSyllabusBySyllabusId(publicId);
    if (!deleted)
        throw new customError_1.default('Syllabus not found.', 404);
};
exports.deleteSyllabus = deleteSyllabus;
//# sourceMappingURL=syllabus.service.js.map