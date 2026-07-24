//client/src/types/index.ts


// ─── User ─────────────────────────────────────────────────────────────────────
export interface IUser {
  publicId: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  accountVerified: boolean;
  streak: IStreak;
  activityLog: IActivityEntry[];
  totalQuizzesTaken: number;
  totalTopicsSearched: number;
}

export interface IStreak {
  current: number;
  longest: number;
  lastActivityDate: string | null;
}

export interface IActivityEntry {
  date: string; // YYYY-MM-DD
  count: number;
}

// ─── Syllabus ─────────────────────────────────────────────────────────────────

export interface IReferenceLink {
  title: string;
  url: string;
  source: string;
}

export interface IVideoLink {
  title: string;
  videoId: string;
  url: string;
  thumbnail: string;
}

export interface ISyllabus {
  syllabusId: string;   // not publicId
  topic: string;
  content: string;
  videoLinks: IVideoLink[];
  referenceLinks: IReferenceLink[];  // yeh bhi mock me missing tha
  contentType: 'text' | 'video' | 'both';
  createdAt: string;
}

export interface SyllabusState {
  topics: ISyllabus[];
  currentSyllabus: ISyllabus | null;
  loading: boolean;
  aiLoading: boolean;
}






// // ─── Quiz ─────────────────────────────────────────────────────────────────────
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';


export interface IQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface IQuiz {
  quizId: string;
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  totalQuestions: number;
  questions: IQuestion[];
  score: number | null;
  timeTakenSeconds: number | null;
  completedAt: string | null;
  createdAt: string;
}

export interface QuizState {
  quizzes: IQuiz[];
  currentQuiz: IQuiz | null;
  leaderboard: ILeaderboardEntry[];
  loading: boolean;
  aiLoading: boolean;
  currentQuestionIndex: number;
  selectedAnswers: Record<number, string>;
  submitted: boolean;
}

// ─── Bookmark ─────────────────────────────────────────────────────────────────

export interface IBookmark {
  bookmarkId: string;
  syllabusId: string;
  topic: string;
  note: string;
  contentType: 'text' | 'video' | 'both';
  createdAt: string;
}

export interface BookmarkState {
  bookmarks: IBookmark[];
  loading: boolean;
}

// ─── Daily Challenge ──────────────────────────────────────────────────────────
export interface IDailyChallenge {
  publicId: string;
  date: string;
  topic: string;
  totalQuestions: number;
  questions: IQuestion[];
}



export interface IDailyChallenge {
  DailyChallengeId: string;
  date: string;
  topic: string;
  totalQuestions: number;
  questions: IQuestion[];
  today: IDailyChallenge | null;
  recent: IRecentChallenge[];
  loading: boolean;
  recentLoading: boolean;
}

export interface IRecentChallenge {
  dailyChallengeId: string;
  date: string;
  topic: string;
  totalQuestions: number;
}

// ─── Leaderboard ──────────────────────────────────────────────────────────────

export interface ILeaderboardEntry {
  _id: string;
  totalScore: number;
  quizCount: number;
  avgScore: number;
  bestScore: number;
  name: string;
  userId: string;
  isCurrentUser?: boolean;
}

// ─── API Response ─────────────────────────────────────────────────────────────
export interface IApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

// ─── Redux State ──────────────────────────────────────────────────────────────
export interface AuthState {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}


export interface ChallengeState {
  todayChallenge: IDailyChallenge | null;
  loading: boolean;
  aiLoading: boolean;
}

export interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
}