import { IQuiz } from '../models/quiz.model';
import { IGenerateQuestionsInput } from '../types';
export declare const generateQuiz: (input: IGenerateQuestionsInput) => Promise<IQuiz>;
export declare const submitQuiz: (publicId: string, score: number, timeTakenSeconds: number) => Promise<IQuiz>;
export declare const getAllQuizzes: (userId: string) => Promise<IQuiz[]>;
export declare const getQuizzesByTopic: (topicPublicId: string) => Promise<IQuiz[]>;
export declare const getQuizByPublicId: (publicId: string) => Promise<IQuiz>;
export declare const getLeaderboard: (limit?: number) => Promise<any[]>;
export declare const deleteQuiz: (publicId: string) => Promise<void>;
//# sourceMappingURL=quiz.service.d.ts.map