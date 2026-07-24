import mongoose from 'mongoose';
import { IQuiz, IQuestion } from '../models/quiz.model';
import { DifficultyLevel } from '../types';
export declare const findQuizByQuizId: (quizId: string) => Promise<IQuiz | null>;
export declare const findQuizByObjectId: (id: string | mongoose.Types.ObjectId) => Promise<IQuiz | null>;
export declare const findAllQuizzesByUserId: (userId: string) => Promise<IQuiz[]>;
export declare const findQuizzesBySyllabusId: (syllabusId: string) => Promise<IQuiz[]>;
export declare const findQuizzesByUserAndDifficulty: (userId: string, difficulty: DifficultyLevel) => Promise<IQuiz[]>;
export declare const getLeaderboard: (limit?: number) => Promise<any[]>;
export declare const createQuiz: (data: {
    userId: string;
    syllabusId: string;
    topic: string;
    difficulty: DifficultyLevel;
    questions: IQuestion[];
}) => Promise<IQuiz>;
export declare const submitQuizResult: (quizId: string, score: number, timeTakenSeconds: number) => Promise<IQuiz | null>;
export declare const deleteQuizByQuizId: (quizId: string) => Promise<boolean>;
//# sourceMappingURL=quiz.repository.d.ts.map