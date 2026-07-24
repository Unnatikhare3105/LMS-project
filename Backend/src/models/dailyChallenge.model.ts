//backend/src/models/dailychallenge.model.ts

import mongoose, { Document, Model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { IQuestion } from './quiz.model';
    
// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface IDailyChallenge extends Document {
    dailyChallengeId: string;
    date: string;         // YYYY-MM-DD – unique per day
    topic: string;
    questions: IQuestion[];
    totalQuestions: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface IDailyChallengeModel extends Model<IDailyChallenge> { }

// ─── Schema ───────────────────────────────────────────────────────────────────

const questionSchema = new Schema<IQuestion>(
    {
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

    },
    { _id: false }
);

const dailyChallengeSchema = new Schema<IDailyChallenge, IDailyChallengeModel>(
    {
        dailyChallengeId: {
            type: String,
            default: () => uuidv4(),
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

    },

    { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

dailyChallengeSchema.index({ date: -1 });

// ─── Export ───────────────────────────────────────────────────────────────────

const DailyChallengeModel = mongoose.model<IDailyChallenge, IDailyChallengeModel>(
    'DailyChallenge',
    dailyChallengeSchema
);
export default DailyChallengeModel;