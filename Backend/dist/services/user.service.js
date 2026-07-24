"use strict";
//backend/src/services/user.service.ts
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
exports.getActivityChart = exports.getUserProfile = exports.loginUser = exports.createUser = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const customError_1 = __importDefault(require("../utils/customError"));
const userRepo = __importStar(require("../repositories/user.repository"));
// ─── Register ─────────────────────────────────────────────────────────────────
const createUser = async (input) => {
    const { email, mobile, password, username } = input;
    const existing = await user_model_1.default.findOne({
        $or: [
            { email, accountVerified: true },
            { mobile, accountVerified: true },
        ],
    });
    if (existing) {
        throw new customError_1.default('An account with this email or mobile already exists.', 409);
    }
    const user = await userRepo.createUser({ name: username, email, mobile, password });
    const token = user.generateAuthToken();
    return { user, token };
};
exports.createUser = createUser;
// ─── Login ────────────────────────────────────────────────────────────────────
const loginUser = async (input) => {
    const { email, password } = input;
    const user = await user_model_1.default.findOne({ email }).select('+password').exec();
    if (!user)
        throw new customError_1.default('Invalid credentials.', 401);
    const match = await user.comparePassword(password);
    if (!match)
        throw new customError_1.default('Invalid credentials.', 401);
    const token = user.generateAuthToken();
    return { user, token };
};
exports.loginUser = loginUser;
// ─── Profile ──────────────────────────────────────────────────────────────────
const getUserProfile = async (userId) => {
    const user = await userRepo.findUserById(userId);
    if (!user)
        throw new customError_1.default('User not found.', 404);
    return user;
};
exports.getUserProfile = getUserProfile;
// ─── Activity chart ───────────────────────────────────────────────────────────
const getActivityChart = async (userId) => {
    const user = await userRepo.findUserById(userId);
    if (!user)
        throw new customError_1.default('User not found.', 404);
    return {
        activityLog: user.activityLog,
        streak: user.streak,
        totalQuizzesTaken: user.totalQuizzesTaken,
        totalTopicsSearched: user.totalTopicsSearched,
    };
};
exports.getActivityChart = getActivityChart;
//# sourceMappingURL=user.service.js.map