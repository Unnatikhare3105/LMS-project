// Backend/src/models/quiz.model.ts
import mongoose, { Document } from 'mongoose';

export interface IQuestion {
  question: string;
  options: string[];
  answer: string;
}

export interface IQuiz extends Document {
  userId: mongoose.Types.ObjectId;
  topic: string;
  questions: IQuestion[];
}
const quizSchema = new mongoose.Schema<IQuiz>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    topic: {
      type: String,
      required: true,
      trim: true
    },
    questions: [
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
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

// Database Indexes for better query performance
quizSchema.index({ userId: 1 }); // Find quizzes by user
quizSchema.index({ topic: 1 }); // Find quizzes by topic (string search)
quizSchema.index({ userId: 1, topic: 1 }); // Compound index
quizSchema.index({ topic: 'text' }); // Text search on topic
quizSchema.index({ createdAt: -1 }); // Sort by newest

const QuizModel = mongoose.model<IQuiz>('Quiz', quizSchema);

export default QuizModel;