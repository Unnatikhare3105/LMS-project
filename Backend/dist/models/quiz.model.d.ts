import { Document, Model } from 'mongoose';
import { DifficultyLevel } from '../types';
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
export interface IQuizModel extends Model<IQuiz> {
}
declare const QuizModel: IQuizModel;
export default QuizModel;
//# sourceMappingURL=quiz.model.d.ts.map