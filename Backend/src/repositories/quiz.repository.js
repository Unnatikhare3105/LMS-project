"use strict";
//backend/src/repositories/quiz.repository.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteQuizByQuizId = exports.submitQuizResult = exports.createQuiz = exports.getLeaderboard = exports.findQuizzesByUserAndDifficulty = exports.findQuizzesBySyllabusId = exports.findAllQuizzesByUserId = exports.findQuizByObjectId = exports.findQuizByQuizId = void 0;
const quiz_model_1 = __importDefault(require("../models/quiz.model"));
// ─── Reads ────────────────────────────────────────────────────────────────────
const findQuizByQuizId = async (quizId) => {
    return quiz_model_1.default.findOne({ quizId }).exec();
};
exports.findQuizByQuizId = findQuizByQuizId;
const findQuizByObjectId = async (id) => {
    return quiz_model_1.default.findById(id).exec();
};
exports.findQuizByObjectId = findQuizByObjectId;
const findAllQuizzesByUserId = async (userId) => {
    return quiz_model_1.default.find({ userId })
        .select('quizId topic difficulty totalQuestions score completedAt createdAt')
        .sort({ createdAt: -1 })
        .exec();
};
exports.findAllQuizzesByUserId = findAllQuizzesByUserId;
const findQuizzesBySyllabusId = async (syllabusId) => {
    return quiz_model_1.default.find({ syllabusId })
        .select('quizId topic difficulty totalQuestions score completedAt createdAt')
        .sort({ createdAt: -1 })
        .exec();
};
exports.findQuizzesBySyllabusId = findQuizzesBySyllabusId;
const findQuizzesByUserAndDifficulty = async (userId, difficulty) => {
    return quiz_model_1.default.find({ userId, difficulty }).sort({ createdAt: -1 }).exec();
};
exports.findQuizzesByUserAndDifficulty = findQuizzesByUserAndDifficulty;
const getLeaderboard = async (limit = 10) => {
    return quiz_model_1.default.aggregate([
        { $match: { score: { $ne: null } } },
        {
            $group: {
                _id: '$userId',
                totalScore: { $sum: '$score' },
                quizCount: { $sum: 1 },
                avgScore: { $avg: '$score' },
                bestScore: { $max: '$score' },
            },
        },
        { $sort: { totalScore: -1 } },
        { $limit: limit },
        {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: 'userId',
                as: 'user',
            },
        },
        { $unwind: '$user' },
        {
            $project: {
                totalScore: 1,
                quizCount: 1,
                bestScore: 1,
                avgScore: { $round: ['$avgScore', 1] },
                'user.name': 1,
                'user.userId': 1,
            },
        },
    ]);
};
exports.getLeaderboard = getLeaderboard;
// ─── Writes ───────────────────────────────────────────────────────────────────
const createQuiz = async (data) => {
    return quiz_model_1.default.create({ ...data, totalQuestions: data.questions.length });
};
exports.createQuiz = createQuiz;
const submitQuizResult = async (quizId, score, timeTakenSeconds) => {
    return quiz_model_1.default.findOneAndUpdate({ quizId }, { $set: { score, timeTakenSeconds, completedAt: new Date() } }, { new: true }).exec();
};
exports.submitQuizResult = submitQuizResult;
const deleteQuizByQuizId = async (quizId) => {
    const result = await quiz_model_1.default.findOneAndDelete({ quizId }).exec();
    return !!result;
};
exports.deleteQuizByQuizId = deleteQuizByQuizId;
//# sourceMappingURL=quiz.repository.js.map