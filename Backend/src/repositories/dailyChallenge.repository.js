"use strict";
//backend/src/repositories/dailyChallenge.repository.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDailyChallenge = exports.getRecentChallenges = exports.findTodayChallenge = exports.findChallengeByDate = void 0;
const dailyChallenge_model_1 = __importDefault(require("../models/dailyChallenge.model"));
// ─── Reads ────────────────────────────────────────────────────────────────────
const findChallengeByDate = async (date) => {
    return dailyChallenge_model_1.default.findOne({ date }).exec();
};
exports.findChallengeByDate = findChallengeByDate;
const findTodayChallenge = async () => {
    const today = new Date().toISOString().split('T')[0];
    return (0, exports.findChallengeByDate)(today);
};
exports.findTodayChallenge = findTodayChallenge;
const getRecentChallenges = async (limit = 7) => {
    return dailyChallenge_model_1.default.find()
        .sort({ date: -1 })
        .limit(limit)
        .select('dailyChallengeId date topic totalQuestions')
        .exec();
};
exports.getRecentChallenges = getRecentChallenges;
// ─── Writes ───────────────────────────────────────────────────────────────────
const createDailyChallenge = async (data) => {
    return dailyChallenge_model_1.default.create({ ...data, totalQuestions: data.questions.length });
};
exports.createDailyChallenge = createDailyChallenge;
//# sourceMappingURL=dailyChallenge.repository.js.map