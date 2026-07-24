// ─────────────────────────────────────────────────────────────────────────────
// Shared Types & Interfaces
// ─────────────────────────────────────────────────────────────────────────────

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export type VerificationMethod = 'email' | 'sms';

export type UserRole = 'student' | 'teacher' | 'admin';

export type ContentType = 'text' | 'video' | 'both';

// ─── Quiz ─────────────────────────────────────────────────────────────────────

export interface IQuestionRaw {
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
}

export interface IGenerateQuestionsInput {
  userId: string;
  topicPublicId: string;
  topicName: string;
  numQuestions: number;
  difficulty: DifficultyLevel;
}

// ─── Syllabus ─────────────────────────────────────────────────────────────────

export interface IGenerateTextInput {
  topic: string;
  userId: string;
}

export interface IGenerateVideoInput {
  topic: string;
  userId: string;
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface ICreateUserInput {
  username: string;
  email: string;
  mobile: string;
  password: string;
}

export interface ILoginInput {
  email: string;
  password: string;
}

// ─── Activity ─────────────────────────────────────────────────────────────────

export interface IDailyActivityEntry {
  date: string;   // YYYY-MM-DD
  count: number;
}

export interface IStreakData {
  current: number;
  longest: number;
  lastActivityDate: Date | null;
}

// ─── API Response ─────────────────────────────────────────────────────────────

export interface IApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface IPaginationQuery {
  page?: number;
  limit?: number;
}