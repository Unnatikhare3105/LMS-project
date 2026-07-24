"use strict";
//backend/src/repositories/user.repository.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.incrementTopicCount = exports.incrementQuizCount = exports.recordActivity = exports.setVerificationCode = exports.updatePassword = exports.saveUser = exports.createUser = exports.findLatestUnverifiedByEmail = exports.findUserByUserId = exports.findUserById = exports.findUserByEmail = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
// ─── Reads ────────────────────────────────────────────────────────────────────
const findUserByEmail = async (email, includePassword = false) => {
    const q = user_model_1.default.findOne({ email });
    if (includePassword)
        q.select('+password');
    return q.exec();
};
exports.findUserByEmail = findUserByEmail;
const findUserById = async (id) => {
    return user_model_1.default.findById(id).select('-password').exec();
};
exports.findUserById = findUserById;
const findUserByUserId = async (userId) => {
    return user_model_1.default.findOne({ userId }).select('-password').exec();
};
exports.findUserByUserId = findUserByUserId;
const findLatestUnverifiedByEmail = async (email) => {
    return user_model_1.default.findOne({ email, accountVerified: false })
        .sort({ createdAt: -1 })
        .exec();
};
exports.findLatestUnverifiedByEmail = findLatestUnverifiedByEmail;
// ─── Writes ───────────────────────────────────────────────────────────────────
const createUser = async (data) => {
    return user_model_1.default.create(data);
};
exports.createUser = createUser;
const saveUser = async (user) => {
    return user.save({ validateModifiedOnly: true });
};
exports.saveUser = saveUser;
const updatePassword = async (email, hashedPassword) => {
    return user_model_1.default.findOneAndUpdate({ email }, { $set: { password: hashedPassword } }, { new: true }).exec();
};
exports.updatePassword = updatePassword;
const setVerificationCode = async (userId, code, expireMinutes) => {
    await user_model_1.default.findByIdAndUpdate(userId, {
        verificationCode: code,
        verificationCodeExpire: new Date(Date.now() + expireMinutes * 60 * 1000),
    }).exec();
};
exports.setVerificationCode = setVerificationCode;
// ─── Streak & Activity ────────────────────────────────────────────────────────
const recordActivity = async (userId) => {
    const today = new Date().toISOString().split('T')[0];
    const user = await user_model_1.default.findById(userId).exec();
    if (!user)
        return;
    const lastDate = user.streak.lastActivityDate
        ? new Date(user.streak.lastActivityDate).toISOString().split('T')[0]
        : null;
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    // Update streak logic
    if (lastDate !== today) {
        if (lastDate === yesterday) {
            user.streak.current += 1;
        }
        else {
            user.streak.current = 1;
        }
        if (user.streak.current > user.streak.longest) {
            user.streak.longest = user.streak.current;
        }
        user.streak.lastActivityDate = new Date();
    }
    // Upsert today's activity entry
    const existingIdx = user.activityLog.findIndex((a) => a.date === today);
    if (existingIdx >= 0) {
        user.activityLog[existingIdx].count += 1;
    }
    else {
        user.activityLog.push({ date: today, count: 1 });
        // Keep only last 365 entries
        if (user.activityLog.length > 365) {
            user.activityLog = user.activityLog.slice(-365);
        }
    }
    await user.save({ validateModifiedOnly: true });
};
exports.recordActivity = recordActivity;
const incrementQuizCount = async (userId) => {
    await user_model_1.default.findByIdAndUpdate(userId, { $inc: { totalQuizzesTaken: 1 } }).exec();
};
exports.incrementQuizCount = incrementQuizCount;
const incrementTopicCount = async (userId) => {
    await user_model_1.default.findByIdAndUpdate(userId, { $inc: { totalTopicsSearched: 1 } }).exec();
};
exports.incrementTopicCount = incrementTopicCount;
//# sourceMappingURL=user.repository.js.map