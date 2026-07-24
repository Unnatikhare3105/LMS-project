"use strict";
//backend/src/models/user.model.ts
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
const mongoose_1 = __importStar(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
// ─── Sub-schemas ──────────────────────────────────────────────────────────────
const streakSchema = new mongoose_1.Schema({
    current: { type: Number, default: 0 },
    longest: { type: Number, default: 0 },
    lastActivityDate: { type: Date, default: null },
}, { _id: false });
const activitySchema = new mongoose_1.Schema({
    date: { type: String, required: true }, // YYYY-MM-DD
    count: { type: Number, default: 1 },
}, { _id: false });
// ─── Main schema ──────────────────────────────────────────────────────────────
const userSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        default: () => (0, uuid_1.v4)(),
        unique: true,
        index: true,
    },
    name: { type: String, required: true, trim: true },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    mobile: { type: String, sparse: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: {
        type: String,
        enum: ['student', 'teacher', 'admin'],
        default: 'student',
    },
    accountVerified: { type: Boolean, default: false },
    verificationCode: { type: Number, default: null },
    verificationCodeExpire: { type: Date, default: null },
    streak: {
        type: streakSchema,
        default: () => ({ current: 0, longest: 0, lastActivityDate: null }),
    },
    activityLog: { type: [activitySchema], default: [] },
    totalQuizzesTaken: { type: Number, default: 0 },
    totalTopicsSearched: { type: Number, default: 0 },
}, { timestamps: true });
// ─── Indexes ──────────────────────────────────────────────────────────────────
userSchema.index({ mobile: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ email: 1, accountVerified: 1 });
// ─── Pre-save ─────────────────────────────────────────────────────────────────
userSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    this.password = await bcrypt_1.default.hash(this.password, 12);
    next();
});
// ─── Instance methods ─────────────────────────────────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt_1.default.compare(candidatePassword, this.password);
};
userSchema.methods.generateAuthToken = function () {
    return jsonwebtoken_1.default.sign({ _id: this._id.toString(), userId: this.userId, role: this.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
};
// ─── Static methods ───────────────────────────────────────────────────────────
userSchema.statics.hashPassword = async function (password) {
    return bcrypt_1.default.hash(password, 12);
};
userSchema.statics.verifyAuthToken = function (token) {
    return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'secret');
};
userSchema.statics.generateVerificationCode = function () {
    return Math.floor(100000 + Math.random() * 900000);
};
// ─── Export ───────────────────────────────────────────────────────────────────
const UserModel = mongoose_1.default.model('User', userSchema);
exports.default = UserModel;
//# sourceMappingURL=user.model.js.map