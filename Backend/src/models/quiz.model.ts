// Backend/src/models/quiz.model.ts
import mongoose, { Document, Model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { DifficultyLevel } from '../types';

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface IQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface IQuiz extends Document {
  quizId: string;
  userId: string;
  syllabusId: string;
  topic: string;
  difficulty: DifficultyLevel;
  questions: IQuestion[];
  totalQuestions: number;
  score: number | null;
  timeTakenSeconds: number | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IQuizModel extends Model<IQuiz> { }

// ─── Sub-schema ───────────────────────────────────────────────────────────────

const questionSchema = new Schema<IQuestion>(
  {
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    answer: { type: String, required: true },
    explanation: { type: String, default: '' },
  },
  { _id: false }
);

// ─── Main schema ──────────────────────────────────────────────────────────────

const quizSchema = new Schema<IQuiz, IQuizModel>(
  {
    quizId: {
      type: String,
      default: () => uuidv4(),
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

  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

quizSchema.index({ userId: 1 });
quizSchema.index({ syllabusId: 1 });
quizSchema.index({ userId: 1, syllabusId: 1 });
quizSchema.index({ difficulty: 1 });
quizSchema.index({ score: -1 });
quizSchema.index({ createdAt: -1 });

// ─── Export ───────────────────────────────────────────────────────────────────

const QuizModel = mongoose.model<IQuiz, IQuizModel>('Quiz', quizSchema);
export default QuizModel;
