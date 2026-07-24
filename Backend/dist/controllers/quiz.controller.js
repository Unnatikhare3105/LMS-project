"use strict";
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
exports.deleteQuizController = exports.getLeaderboardController = exports.getQuizByIdController = exports.getQuizzesByTopicController = exports.getAllQuizzesController = exports.submitQuizController = exports.generateQuizController = void 0;
const customError_1 = __importDefault(require("../utils/customError"));
const quizService = __importStar(require("../services/quiz.service"));
const syllabusRepo = __importStar(require("../repositories/syllabus.repository"));
const VALID_DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];
const generateQuizController = async (req, res, next) => {
    try {
        const { syllabusId } = req.params; // UUID
        const { numQuestions, difficulty } = req.body;
        if (!syllabusId)
            return next(new customError_1.default('Syllabus ID is required.', 400));
        if (!numQuestions || typeof numQuestions !== 'number' || numQuestions < 1 || numQuestions > 30) {
            return next(new customError_1.default('numQuestions must be between 1 and 30.', 400));
        }
        if (!difficulty || !VALID_DIFFICULTIES.includes(difficulty)) {
            return next(new customError_1.default(`difficulty must be one of: ${VALID_DIFFICULTIES.join(', ')}.`, 400));
        }
        const syllabus = await syllabusRepo.findSyllabusBySyllabusId(syllabusId);
        if (!syllabus)
            return next(new customError_1.default('Topic not found.', 404));
        const quiz = await quizService.generateQuiz({
            userId: req.user._id.toString(),
            topicPublicId: syllabusId,
            topicName: syllabus.topic,
            numQuestions,
            difficulty,
        });
        res.status(201).json({
            success: true,
            message: 'Quiz generated successfully.',
            data: {
                quizId: quiz.quizId,
                topic: quiz.topic,
                difficulty: quiz.difficulty,
                totalQuestions: quiz.totalQuestions,
                questions: quiz.questions,
                createdAt: quiz.createdAt,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.generateQuizController = generateQuizController;
const submitQuizController = async (req, res, next) => {
    try {
        const { quizId } = req.params; // UUID
        const { score, timeTakenSeconds } = req.body;
        if (!quizId)
            return next(new customError_1.default('Quiz ID is required.', 400));
        if (score === undefined || score === null)
            return next(new customError_1.default('Score is required.', 400));
        if (!timeTakenSeconds)
            return next(new customError_1.default('timeTakenSeconds is required.', 400));
        const quiz = await quizService.submitQuiz(quizId, Number(score), Number(timeTakenSeconds));
        res.status(200).json({
            success: true,
            message: 'Quiz submitted.',
            data: {
                quizId: quiz.quizId,
                topic: quiz.topic,
                difficulty: quiz.difficulty,
                score: quiz.score,
                totalQuestions: quiz.totalQuestions,
                timeTakenSeconds: quiz.timeTakenSeconds,
                completedAt: quiz.completedAt,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.submitQuizController = submitQuizController;
const getAllQuizzesController = async (req, res, next) => {
    try {
        const quizzes = await quizService.getAllQuizzes(req.user._id.toString());
        res.status(200).json({ success: true, data: quizzes });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllQuizzesController = getAllQuizzesController;
const getQuizzesByTopicController = async (req, res, next) => {
    try {
        const { syllabusId } = req.params; // UUID
        if (!syllabusId)
            return next(new customError_1.default('Syllabus ID is required.', 400));
        const quizzes = await quizService.getQuizzesByTopic(syllabusId);
        res.status(200).json({ success: true, data: quizzes });
    }
    catch (error) {
        next(error);
    }
};
exports.getQuizzesByTopicController = getQuizzesByTopicController;
const getQuizByIdController = async (req, res, next) => {
    try {
        const { quizId } = req.params; // UUID
        if (!quizId)
            return next(new customError_1.default('Quiz ID is required.', 400));
        const quiz = await quizService.getQuizByPublicId(quizId);
        res.status(200).json({ success: true, data: quiz });
    }
    catch (error) {
        next(error);
    }
};
exports.getQuizByIdController = getQuizByIdController;
const getLeaderboardController = async (req, res, next) => {
    try {
        const limit = Math.min(Number(req.query.limit) || 10, 50);
        const leaderboard = await quizService.getLeaderboard(limit);
        res.status(200).json({ success: true, data: leaderboard });
    }
    catch (error) {
        next(error);
    }
};
exports.getLeaderboardController = getLeaderboardController;
const deleteQuizController = async (req, res, next) => {
    try {
        const { quizId } = req.params; // UUID
        if (!quizId)
            return next(new customError_1.default('Quiz ID is required.', 400));
        await quizService.deleteQuiz(quizId);
        res.status(200).json({ success: true, message: 'Quiz deleted.' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteQuizController = deleteQuizController;
//# sourceMappingURL=quiz.controller.js.map