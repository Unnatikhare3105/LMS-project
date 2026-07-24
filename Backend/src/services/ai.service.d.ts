import { DifficultyLevel, IQuestionRaw } from '../types';
export declare const getDetailedExplanation: (topic: string) => Promise<string>;
export interface IVideoResult {
    title: string;
    videoId: string;
    url: string;
    thumbnail: string;
}
export declare const getVideoLinks: (topic: string, maxResults?: number) => Promise<IVideoResult[]>;
export interface IReferenceLink {
    title: string;
    url: string;
    source: string;
}
export declare const getReferenceLinks: (topic: string) => Promise<IReferenceLink[]>;
export declare const generateQuestionsByAI: (topic: string, numQuestions: number, difficulty: DifficultyLevel) => Promise<IQuestionRaw[]>;
export declare const getDailyChallengeTopic: () => Promise<string>;
/**
 * Verifies the Groq API key/connection works by listing available models.
 * Call this once at server startup (non-blocking) to catch bad keys or
 * network/DNS issues early instead of on the first user request.
 */
export declare const checkGroqConnection: () => Promise<boolean>;
//# sourceMappingURL=ai.service.d.ts.map