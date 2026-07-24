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
Object.defineProperty(exports, "__esModule", { value: true });
// Backend/src/models/quiz.model.ts
const mongoose_1 = __importStar(require("mongoose"));
const uuid_1 = require("uuid");
// ─── Sub-schema ───────────────────────────────────────────────────────────────
const questionSchema = new mongoose_1.Schema({
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    answer: { type: String, required: true },
    explanation: { type: String, default: '' },
}, { _id: false });
// ─── Main schema ──────────────────────────────────────────────────────────────
const quizSchema = new mongoose_1.Schema({
    quizId: {
        type: String,
        default: () => (0, uuid_1.v4)(),
        unique: true,
        index: true,
    },
    userId: {
        type: String,
        ref: 'User',
        required: true
    },
    syllabusId: {
        type: String,
        ref: 'Syllabus',
        required: true
    },
    topic: {
        type: String,
        required: true,
        trim: true
    },
    difficulty: {
        type: String,
        enum: ['beginner',
            'intermediate',
            'advanced'],
        default: 'beginner',
    },
    questions: {
        type: [questionSchema],
        required: true
    },
    totalQuestions: {
        type: Number,
        required: true
    },
    score: {
        type: Number,
        default: null
    },
    timeTakenSeconds: {
        type: Number,
        default: null
    },
    completedAt: {
        type: Date,
        default: null
    },
}, { timestamps: true });
// ─── Indexes ──────────────────────────────────────────────────────────────────
quizSchema.index({ userId: 1 });
quizSchema.index({ syllabusId: 1 });
quizSchema.index({ userId: 1, syllabusId: 1 });
quizSchema.index({ difficulty: 1 });
quizSchema.index({ score: -1 });
quizSchema.index({ createdAt: -1 });
// ─── Export ───────────────────────────────────────────────────────────────────
const QuizModel = mongoose_1.default.model('Quiz', quizSchema);
exports.default = QuizModel;
// import mongoose, { Document } from 'mongoose';
// export interface IQuestion {
//   question: string;
//   options: string[];
//   answer: string;
// }
// export interface IQuiz extends Document {
//   userId: mongoose.Types.ObjectId;
//   topic: string;
//   questions: IQuestion[];
// }
// const quizSchema = new mongoose.Schema<IQuiz>(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true
//     },
//     topic: {
//       type: String,
//       required: true,
//       trim: true
//     },
//     questions: [
//       {
//         question: {
//           type: String,
//           required: true
//         },
//         options: [{
//           type: String,
//           required: true
//         }],
//         answer: {
//           type: String,
//           required: true
//         }
//       }
//     ]
//   },
//   {
//     timestamps: true
//   }
// );
// // Database Indexes for better query performance
// quizSchema.index({ userId: 1 }); // Find quizzes by user
// quizSchema.index({ topic: 1 }); // Find quizzes by topic (string search)
// quizSchema.index({ userId: 1, topic: 1 }); // Compound index
// quizSchema.index({ topic: 'text' }); // Text search on topic
// quizSchema.index({ createdAt: -1 }); // Sort by newest
// const QuizModel = mongoose.model<IQuiz>('Quiz', quizSchema);
// export default QuizModel;
//# sourceMappingURL=quiz.model.js.map