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
exports.getRecentChallenges = exports.getTodayChallenge = void 0;
const customError_1 = __importDefault(require("../utils/customError"));
const challengeRepo = __importStar(require("../repositories/dailyChallenge.repository"));
const aiService = __importStar(require("./ai.service"));
const DAILY_QUESTIONS = 5;
const getTodayChallenge = async () => {
    const today = new Date().toISOString().split('T')[0];
    // Return existing if already generated today
    const existing = await challengeRepo.findChallengeByDate(today);
    if (existing)
        return existing;
    // Generate fresh challenge
    const topic = await aiService.getDailyChallengeTopic();
    const questions = await aiService.generateQuestionsByAI(topic, DAILY_QUESTIONS, 'intermediate');
    if (!questions.length)
        throw new customError_1.default('Failed to generate daily challenge.', 500);
    return challengeRepo.createDailyChallenge({ date: today, topic, questions });
};
exports.getTodayChallenge = getTodayChallenge;
const getRecentChallenges = async (limit = 7) => {
    return challengeRepo.getRecentChallenges(limit);
};
exports.getRecentChallenges = getRecentChallenges;
//# sourceMappingURL=dailyChallenge.service.js.map