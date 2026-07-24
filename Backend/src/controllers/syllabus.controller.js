"use strict";
//Backend/src/controllers/syllabus.controller.ts
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
exports.deleteSyllabusController = exports.updateSyllabusController = exports.getSyllabusByIdController = exports.getAllTopicsController = exports.generateVideoController = exports.generateTextController = exports.generateFullController = void 0;
const customError_1 = __importDefault(require("../utils/customError"));
const syllabusService = __importStar(require("../services/syllabus.service"));
const generateFullController = async (req, res, next) => {
    try {
        const { topic } = req.body;
        if (!topic || typeof topic !== 'string' || !topic.trim()) {
            return next(new customError_1.default('Topic is required.', 400));
        }
        const syllabus = await syllabusService.generateFullContent({
            topic: topic.trim(),
            userId: req.user.userId,
        });
        res.status(200).json({
            success: true,
            message: 'Content generated successfully.',
            data: {
                syllabusId: syllabus.syllabusId,
                topic: syllabus.topic,
                content: syllabus.content,
                videoLinks: syllabus.videoLinks,
                referenceLinks: syllabus.referenceLinks,
                contentType: syllabus.contentType,
                createdAt: syllabus.createdAt,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.generateFullController = generateFullController;
const generateTextController = async (req, res, next) => {
    try {
        const { topic } = req.body;
        if (!topic || typeof topic !== 'string' || !topic.trim()) {
            return next(new customError_1.default('Topic is required.', 400));
        }
        const syllabus = await syllabusService.generateContentAsText({
            topic: topic.trim(),
            userId: req.user.userId,
        });
        // res.status(200).json({
        //   success: true,
        //   message: 'Content generated successfully.',
        //   data: {
        //     syllabusId: syllabus.syllabusId,
        //     topic: syllabus.topic,
        //     content: syllabus.content,
        //     contentType: syllabus.contentType,
        //     createdAt: syllabus.createdAt,
        //   },
        // });
        res.status(200).json({
            success: true,
            message: 'Content generated successfully.',
            data: {
                syllabusId: syllabus.syllabusId,
                topic: syllabus.topic,
                content: syllabus.content,
                videoLinks: syllabus.videoLinks,
                referenceLinks: syllabus.referenceLinks,
                contentType: syllabus.contentType,
                createdAt: syllabus.createdAt,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.generateTextController = generateTextController;
const generateVideoController = async (req, res, next) => {
    try {
        const { topic } = req.body;
        if (!topic || typeof topic !== 'string' || !topic.trim()) {
            return next(new customError_1.default('Topic is required.', 400));
        }
        const syllabus = await syllabusService.generateContentAsVideo({
            topic: topic.trim(),
            userId: req.user.userId,
        });
        // res.status(200).json({
        //   success: true,
        //   message: 'Video links fetched successfully.',
        //  data: {
        //     syllabusId: syllabus.syllabusId,
        //     topic: syllabus.topic,
        //     videoLinks: syllabus.videoLinks,
        //     referenceLinks: syllabus.referenceLinks,
        //     contentType: syllabus.contentType,
        //     createdAt: syllabus.createdAt,
        //   },
        // });
        res.status(200).json({
            success: true,
            message: 'Content generated successfully.',
            data: {
                syllabusId: syllabus.syllabusId,
                topic: syllabus.topic,
                content: syllabus.content,
                videoLinks: syllabus.videoLinks,
                referenceLinks: syllabus.referenceLinks,
                contentType: syllabus.contentType,
                createdAt: syllabus.createdAt,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.generateVideoController = generateVideoController;
const getAllTopicsController = async (req, res, next) => {
    try {
        const topics = await syllabusService.getAllTopics(req.user._id.toString());
        res.status(200).json({ success: true, data: topics });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllTopicsController = getAllTopicsController;
const getSyllabusByIdController = async (req, res, next) => {
    try {
        const { syllabusId } = req.params; // UUID
        if (!syllabusId)
            return next(new customError_1.default('Syllabus ID is required.', 400));
        const syllabus = await syllabusService.getSyllabusByPublicId(syllabusId, req.user.userId);
        res.status(200).json({ success: true, data: syllabus });
    }
    catch (error) {
        next(error);
    }
};
exports.getSyllabusByIdController = getSyllabusByIdController;
const updateSyllabusController = async (req, res, next) => {
    try {
        const { syllabusId } = req.params; // UUID
        const { content } = req.body;
        if (!syllabusId)
            return next(new customError_1.default('Syllabus ID is required.', 400));
        if (!content)
            return next(new customError_1.default('Content is required.', 400));
        const updated = await syllabusService.updateSyllabusContent(syllabusId, content, req.user.userId);
        res.status(200).json({ success: true, message: 'Syllabus updated.', data: updated });
    }
    catch (error) {
        next(error);
    }
};
exports.updateSyllabusController = updateSyllabusController;
const deleteSyllabusController = async (req, res, next) => {
    try {
        const { syllabusId } = req.params; // UUID
        if (!syllabusId)
            return next(new customError_1.default('Syllabus ID is required.', 400));
        await syllabusService.deleteSyllabus(syllabusId, req.user.userId);
        res.status(200).json({ success: true, message: 'Syllabus deleted.' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteSyllabusController = deleteSyllabusController;
//# sourceMappingURL=syllabus.controller.js.map