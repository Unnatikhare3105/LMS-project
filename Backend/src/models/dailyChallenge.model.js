"use strict";
//backend/src/models/dailychallenge.model.ts
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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const uuid_1 = require("uuid");
// ─── Schema ───────────────────────────────────────────────────────────────────
const questionSchema = new mongoose_1.Schema({
    question: {
        type: String,
        required: true
    },
    options: [{
            type: String,
            required: true
        }],
    answer: {
        type: String,
        required: true
    },
    explanation: {
        type: String,
        default: ''
    },
}, { _id: false });
const dailyChallengeSchema = new mongoose_1.Schema({
    dailyChallengeId: {
        type: String,
        default: () => (0, uuid_1.v4)(),
        unique: true,
        index: true,
    },
    date: {
        type: String,
        required: true,
        unique: true
    },
    topic: {
        type: String,
        required: true,
        trim: true
    },
    questions: {
        type: [questionSchema],
        required: true
    },
    totalQuestions: {
        type: Number,
        required: true
    },
}, { timestamps: true });
// ─── Indexes ──────────────────────────────────────────────────────────────────
dailyChallengeSchema.index({ date: -1 });
// ─── Export ───────────────────────────────────────────────────────────────────
const DailyChallengeModel = mongoose_1.default.model('DailyChallenge', dailyChallengeSchema);
exports.default = DailyChallengeModel;
//# sourceMappingURL=dailyChallenge.model.js.map