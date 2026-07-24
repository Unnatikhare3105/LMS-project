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
exports.deleteQuiz = exports.getLeaderboard = exports.getQuizByPublicId = exports.getQuizzesByTopic = exports.getAllQuizzes = exports.submitQuiz = exports.generateQuiz = void 0;
const customError_1 = __importDefault(require("../utils/customError"));
const quizRepo = __importStar(require("../repositories/quiz.repository"));
const syllabusRepo = __importStar(require("../repositories/syllabus.repository"));
const userRepo = __importStar(require("../repositories/user.repository"));
const aiService = __importStar(require("./ai.service"));
// ─── Generate quiz ────────────────────────────────────────────────────────────
const generateQuiz = async (input) => {
    const { userId, topicPublicId, topicName, numQuestions, difficulty } = input;
    // Resolve publicId → internal ObjectId
    const syllabusObjId = await syllabusRepo.getObjectIdBySyllabusId(topicPublicId);
    if (!syllabusObjId)
        throw new customError_1.default('Topic not found.', 404);
    const questions = await aiService.generateQuestionsByAI(topicName, numQuestions, difficulty);
    if (!questions.length)
        throw new customError_1.default('Failed to generate questions.', 500);
    const quiz = await quizRepo.createQuiz({
        userId,
        syllabusId: topicPublicId,
        topic: topicName,
        difficulty,
        questions,
    });
    // Non-blocking activity tracking
    userRepo.recordActivity(userId).catch(() => { });
    userRepo.incrementQuizCount(userId).catch(() => { });
    return quiz;
};
exports.generateQuiz = generateQuiz;
// ─── Submit result ────────────────────────────────────────────────────────────
const submitQuiz = async (publicId, score, timeTakenSeconds) => {
    const updated = await quizRepo.submitQuizResult(publicId, score, timeTakenSeconds);
    if (!updated)
        throw new customError_1.default('Quiz not found.', 404);
    return updated;
};
exports.submitQuiz = submitQuiz;
// ─── Reads ────────────────────────────────────────────────────────────────────
const getAllQuizzes = async (userId) => {
    const quizzes = await quizRepo.findAllQuizzesByUserId(userId);
    if (!quizzes.length)
        throw new customError_1.default('No quizzes found.', 404);
    return quizzes;
};
exports.getAllQuizzes = getAllQuizzes;
const getQuizzesByTopic = async (topicPublicId) => {
    const syllabusObjId = await syllabusRepo.getObjectIdBySyllabusId(topicPublicId);
    if (!syllabusObjId)
        throw new customError_1.default('Topic not found.', 404);
    const quizzes = await quizRepo.findQuizzesBySyllabusId(topicPublicId);
    if (!quizzes.length)
        throw new customError_1.default('No quizzes found for this topic.', 404);
    return quizzes;
};
exports.getQuizzesByTopic = getQuizzesByTopic;
const getQuizByPublicId = async (publicId) => {
    const quiz = await quizRepo.findQuizByQuizId(publicId);
    if (!quiz)
        throw new customError_1.default('Quiz not found.', 404);
    return quiz;
};
exports.getQuizByPublicId = getQuizByPublicId;
const getLeaderboard = async (limit = 10) => {
    return quizRepo.getLeaderboard(limit);
};
exports.getLeaderboard = getLeaderboard;
const deleteQuiz = async (publicId) => {
    const deleted = await quizRepo.deleteQuizByQuizId(publicId);
    if (!deleted)
        throw new customError_1.default('Quiz not found.', 404);
};
exports.deleteQuiz = deleteQuiz;
//# sourceMappingURL=quiz.service.js.map