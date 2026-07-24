//backend/src/app.ts

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors'; import morgan from 'morgan'; import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { connectDB } from './db/db';
import userRoutes from './routers/user.routes';
import syllabusRoutes from './routers/syllabus.routes';
import quizRoutes from './routers/quiz.routes';
import bookmarkRoutes from './routers/bookmark.routes';
import dailyChallengeRoutes from './routers/dailyChallenge.routes';
import { errorHandler, notFound } from '@middlewares/error.middleware';
import { checkGroqConnection } from '@services/ai.service';

const app = express();

connectDB();


app.use(helmet());
app.use(morgan('dev'));

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

app.get(
  '/health',
  (_req, res) => res.json({
    success: true,
    message: 'LMS Server healthy.'
  }));

checkGroqConnection()
  // .then(() => console.log('Groq check done'))
  // .catch(console.error);


app.use(
  '/api/user',
  userRoutes
);
app.use('/api/syllabus',
  syllabusRoutes
);
app.use(
  '/api/quiz',
  quizRoutes
);
app.use(
  '/api/bookmarks',
  bookmarkRoutes
);
app.use(
  '/api/daily-challenge',
  dailyChallengeRoutes
);


// listAvailableModels().then(() => console.log('done')).catch(console.error);

app.use(notFound);
app.use(errorHandler);

export default app;


//Backend/src/routers/syllabus.routes.ts

import express from 'express';
import * as syllabusController from '../controllers/syllabus.controller';
import { authUser } from '../middlewares/auth.middleware';

const router = express.Router();

router.use(authUser);

// POST /api/syllabus/generate/text        body: { topic }
// POST /api/syllabus/generate/video       body: { topic }
// GET  /api/syllabus                      all topics for user
// GET  /api/syllabus/:syllabusId          get one (syllabusId = UUID)
// PUT  /api/syllabus/:syllabusId          update content
// DELETE /api/syllabus/:syllabusId        delete

router.post('/generate/text', syllabusController.generateTextController);
router.post('/generate/video', syllabusController.generateVideoController);
router.get('/', syllabusController.getAllTopicsController);
router.get('/:syllabusId', syllabusController.getSyllabusByIdController);
router.put('/:syllabusId', syllabusController.updateSyllabusController);
router.delete('/:syllabusId', syllabusController.deleteSyllabusController);

export default router;
//Backend/src/controllers/syllabus.controller.ts

import { Request, Response, NextFunction } from 'express';
import CustomError from '../utils/customError';
import * as syllabusService from '../services/syllabus.service';

export const generateTextController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { topic } = req.body;
    if (!topic || typeof topic !== 'string' || !topic.trim()) {
      return next(new CustomError('Topic is required.', 400));
    }

    const syllabus = await syllabusService.generateContentAsText({
      topic: topic.trim(),
      userId: req.user.userId,
    });

    res.status(200).json({
      success: true,
      message: 'Content generated successfully.',
      data: {
        syllabusId: syllabus.syllabusId,
        topic: syllabus.topic,
        content: syllabus.content,
        contentType: syllabus.contentType,
        createdAt: syllabus.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const generateVideoController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { topic } = req.body;
    if (!topic || typeof topic !== 'string' || !topic.trim()) {
      return next(new CustomError('Topic is required.', 400));
    }

    const syllabus = await syllabusService.generateContentAsVideo({
      topic: topic.trim(),
      userId: req.user.userId,
    });

    res.status(200).json({
      success: true,
      message: 'Video links fetched successfully.',
     data: {
        syllabusId: syllabus.syllabusId,
        topic: syllabus.topic,
        videoLinks: syllabus.videoLinks,
        referenceLinks: syllabus.referenceLinks,
        contentType: syllabus.contentType,
        createdAt: syllabus.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllTopicsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const topics = await syllabusService.getAllTopics(req.user._id.toString());
    res.status(200).json({ success: true, data: topics });
  } catch (error) {
    next(error);
  }
};

export const getSyllabusByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { syllabusId } = req.params; // UUID
    if (!syllabusId) return next(new CustomError('Syllabus ID is required.', 400));

    const syllabus = await syllabusService.getSyllabusByPublicId(syllabusId, req.user.userId);
    res.status(200).json({ success: true, data: syllabus });
  } catch (error) {
    next(error);
  }
};

export const updateSyllabusController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { syllabusId } = req.params; // UUID
    const { content } = req.body;

    if (!syllabusId) return next(new CustomError('Syllabus ID is required.', 400));
    if (!content) return next(new CustomError('Content is required.', 400));

    const updated = await syllabusService.updateSyllabusContent(syllabusId, content, req.user.userId);
    res.status(200).json({ success: true, message: 'Syllabus updated.', data: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteSyllabusController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { syllabusId } = req.params; // UUID
    if (!syllabusId) return next(new CustomError('Syllabus ID is required.', 400));

    await syllabusService.deleteSyllabus(syllabusId, req.user.userId);
    res.status(200).json({ success: true, message: 'Syllabus deleted.' });
  } catch (error) {
    next(error);
  }
};

//Backend/src/services/syllabus.service.ts

import CustomError from '../utils/customError';
import * as syllabusRepo from '../repositories/syllabus.repository';
import * as userRepo from '../repositories/user.repository';
import * as aiService from './ai.service';
import { ISyllabus } from '../models/syllabus.model';

// ─── Generate text content ────────────────────────────────────────────────────

export const generateContentAsText = async ({
  topic,
  userId,
}: {
  topic: string;
  userId: string;
}): Promise<ISyllabus> => {
  // Return cached version if already generated for this user + topic
  const existing = await syllabusRepo.findSyllabusByUserAndTopic(userId, topic);
  if (existing && existing.content) return existing;

  const content = await aiService.getDetailedExplanation(topic);
  if (!content) throw new CustomError('AI returned no content.', 500);

  const syllabus = await syllabusRepo.createTextSyllabus({ userId, topic, content });

  // Fire and forget – non-blocking activity tracking
  userRepo.recordActivity(userId).catch(() => { });
  userRepo.incrementTopicCount(userId).catch(() => { });

  return syllabus;
};

// ─── Generate video content ───────────────────────────────────────────────────

export const generateContentAsVideo = async ({
  topic,
  userId,
}: {
  topic: string;
  userId: string;
}): Promise<ISyllabus> => {
  const [videos, references] = await Promise.all([
    aiService.getVideoLinks(topic),
    aiService.getReferenceLinks(topic),
  ]);

  if (!videos || videos.length === 0) {
    throw new CustomError('No videos found for this topic.', 404);
  }

  const syllabus = await syllabusRepo.createVideoSyllabus({
    userId,
    topic,
    videoLinks: videos,
    referenceLinks: references,
  });

  // export const generateContentAsVideo = async ({
  //   topic,
  //   userId,
  // }: {
  //   topic: string;
  //   userId: string;
  // }): Promise<ISyllabus> => {
  //   const videos = await aiService.getVideoLinks(topic);
  //   if (!videos || videos.length === 0) {
  //     throw new CustomError('No videos found for this topic.', 404);
  //   }

  //   const syllabus = await syllabusRepo.createVideoSyllabus({
  //     userId,
  //     topic,
  //     videoLinks: videos,
  //   });

  userRepo.recordActivity(userId).catch(() => { });
  userRepo.incrementTopicCount(userId).catch(() => { });

  return syllabus;
};

// ─── Reads ────────────────────────────────────────────────────────────────────

export const getAllTopics = async (userId: string): Promise<ISyllabus[]> => {
  const topics = await syllabusRepo.findSyllabusByUserId(userId);
  if (!topics.length) throw new CustomError('No topics found.', 404);
  return topics;
};

export const getSyllabusByPublicId = async (publicId: string, userId: string): Promise<ISyllabus> => {
  const syllabus = await syllabusRepo.findSyllabusBySyllabusId(publicId);
  if (!syllabus) throw new CustomError('Syllabus not found.', 404);
  if (syllabus.userId.toString() !== userId) throw new CustomError('Forbidden.', 403);
  return syllabus;
};

// ─── Mutations ────────────────────────────────────────────────────────────────

export const updateSyllabusContent = async (
  publicId: string,
  content: string,
  userId: string
): Promise<ISyllabus> => {
  const existing = await syllabusRepo.findSyllabusBySyllabusId(publicId);
  if (!existing) throw new CustomError('Syllabus not found.', 404);
  if (existing.userId.toString() !== userId) throw new CustomError('Forbidden.', 403);

  const updated = await syllabusRepo.updateSyllabusContent(publicId, content);
  if (!updated) throw new CustomError('Syllabus not found or update failed.', 404);
  return updated;
};

export const deleteSyllabus = async (publicId: string, userId: string): Promise<void> => {
  const existing = await syllabusRepo.findSyllabusBySyllabusId(publicId);
  if (!existing) throw new CustomError('Syllabus not found.', 404);
  if (existing.userId.toString() !== userId) throw new CustomError('Forbidden.', 403);

  const deleted = await syllabusRepo.deleteSyllabusBySyllabusId(publicId);
  if (!deleted) throw new CustomError('Syllabus not found.', 404);
};

//Backend/src/repositories/syllabus.repository.ts

import mongoose from 'mongoose';
import SyllabusModel, { ISyllabus, IVideoLink, IReferenceLink } from '../models/syllabus.model';

// ─── Reads ────────────────────────────────────────────────────────────────────

export const findSyllabusBySyllabusId = async (syllabusId: string): Promise<ISyllabus | null> => {
  return SyllabusModel.findOne({ syllabusId }).exec();
};

export const findSyllabusByObjectId = async (
  id: string | mongoose.Types.ObjectId
): Promise<ISyllabus | null> => {
  return SyllabusModel.findById(id).exec();
};

export const findSyllabusByUserId = async (
  userId: string
): Promise<ISyllabus[]> => {
  return SyllabusModel.find({ userId })
    .select('syllabusId topic contentType createdAt')
    .sort({ createdAt: -1 })
    .exec();
};

export const findSyllabusByUserAndTopic = async (
  userId: string,
  topic: string
): Promise<ISyllabus | null> => {
  return SyllabusModel.findOne({ userId, topic }).exec();
};

export const searchSyllabusByTopic = async (
  userId: string,
  searchTerm: string
): Promise<ISyllabus[]> => {
  return SyllabusModel.find({
    userId,
    $text: { $search: searchTerm },
  })
    .select('syllabusId topic contentType createdAt')
    .sort({ createdAt: -1 })
    .exec();
};

// Resolves syllabusId → internal ObjectId (used internally by services)
export const getObjectIdBySyllabusId = async (
  syllabusId: string
): Promise<mongoose.Types.ObjectId | null> => {
  const doc = await SyllabusModel.findOne({ syllabusId }).select('_id').lean().exec();
  return doc ? (doc as any)._id : null;
};

// ─── Writes ───────────────────────────────────────────────────────────────────

export const createTextSyllabus = async (data: {
  userId: string;
  topic: string;
  content: string;
}): Promise<ISyllabus> => {
  return SyllabusModel.create({ ...data, contentType: 'text' });
};

export const createVideoSyllabus = async (data: {
  userId: string;
  topic: string;
  videoLinks: IVideoLink[];
  referenceLinks: IReferenceLink[];
}): Promise<ISyllabus> => {
  return SyllabusModel.create({
    userId: data.userId,
    topic: data.topic,
    content: '',
    videoLinks: data.videoLinks,
    referenceLinks: data.referenceLinks,
    contentType: 'video',
  });
};

// export const createVideoSyllabus = async (data: {
//   userId: string;
//   topic: string;
//   videoLinks: IVideoLink[];
// }): Promise<ISyllabus> => {
//   return SyllabusModel.create({
//     userId: data.userId,
//     topic: data.topic,
//     content: '',
//     videoLinks: data.videoLinks,
//     contentType: 'video',
//   });
// };

export const updateSyllabusContent = async (
  syllabusId: string,
  content: string
): Promise<ISyllabus | null> => {
  return SyllabusModel.findOneAndUpdate(
    { syllabusId },
    { $set: { content } },
    { new: true }
  ).exec();
};

export const deleteSyllabusBySyllabusId = async (syllabusId: string): Promise<boolean> => {
  const result = await SyllabusModel.findOneAndDelete({ syllabusId }).exec();
  return !!result;
};

//backend/src/repositories/user.repository.ts

import mongoose from 'mongoose';
import UserModel, { IUser } from '../models/user.model';

// ─── Reads ────────────────────────────────────────────────────────────────────

export const findUserByEmail = async (
    email: string,
    includePassword = false
): Promise<IUser | null> => {
    const q = UserModel.findOne({ email });
    if (includePassword) q.select('+password');
    return q.exec();
};

export const findUserById = async (
    id: string | mongoose.Types.ObjectId
): Promise<IUser | null> => {
    return UserModel.findById(id).select('-password').exec();
};

export const findUserByUserId = async (userId: string): Promise<IUser | null> => {
    return UserModel.findOne({ userId }).select('-password').exec();
};

export const findLatestUnverifiedByEmail = async (email: string): Promise<IUser | null> => {
    return UserModel.findOne({ email, accountVerified: false })
        .sort({ createdAt: -1 })
        .exec();
};

// ─── Writes ───────────────────────────────────────────────────────────────────

export const createUser = async (data: {
    name: string;
    email: string;
    mobile?: string;
    password: string;
    role?: string;
}): Promise<IUser> => {
    return UserModel.create(data);
};

export const saveUser = async (user: IUser): Promise<IUser> => {
    return user.save({ validateModifiedOnly: true });
};

export const updatePassword = async (
    email: string,
    hashedPassword: string
): Promise<IUser | null> => {
    return UserModel.findOneAndUpdate(
        { email },
        { $set: { password: hashedPassword } },
        { new: true }
    ).exec();
};

export const setVerificationCode = async (
    userId: string,
    code: number,
    expireMinutes: number
): Promise<void> => {
    await UserModel.findByIdAndUpdate(userId, {
        verificationCode: code,
        verificationCodeExpire: new Date(Date.now() + expireMinutes * 60 * 1000),
    }).exec();
};

// ─── Streak & Activity ────────────────────────────────────────────────────────

export const recordActivity = async (
    userId: string
): Promise<void> => {
    const today = new Date().toISOString().split('T')[0];
    // const user = await UserModel.findById(userId).exec();
    const user = await UserModel.findOne({ userId }).exec();
    if (!user) return;

    const lastDate = user.streak.lastActivityDate
        ? new Date(user.streak.lastActivityDate).toISOString().split('T')[0]
        : null;

    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // Update streak logic
    if (lastDate !== today) {
        if (lastDate === yesterday) {
            user.streak.current += 1;
        } else {
            user.streak.current = 1;
        }
        if (user.streak.current > user.streak.longest) {
            user.streak.longest = user.streak.current;
        }
        user.streak.lastActivityDate = new Date();
    }

    // Upsert today's activity entry
    const existingIdx = user.activityLog.findIndex((a) => a.date === today);
    if (existingIdx >= 0) {
        user.activityLog[existingIdx].count += 1;
    } else {
        user.activityLog.push({ date: today, count: 1 });
        // Keep only last 365 entries
        if (user.activityLog.length > 365) {
            user.activityLog = user.activityLog.slice(-365);
        }
    }

    await user.save({ validateModifiedOnly: true });
};

export const incrementQuizCount = async (
    userId: string
): Promise<void> => {
   await UserModel.findOneAndUpdate({ userId }, { $inc: { totalQuizzesTaken: 1 } }).exec();
};

export const incrementTopicCount = async (
    userId: string
): Promise<void> => {
    await UserModel.findOneAndUpdate({ userId }, { $inc: { totalTopicsSearched: 1 } }).exec();
};

//Backend/src/services/ai.service.ts

import OpenAI from 'openai';
import { google } from 'googleapis';
import config from '../config/config';
import CustomError from '../utils/customError';
import { DifficultyLevel, IQuestionRaw } from '../types';

// ─── Init ─────────────────────────────────────────────────────────────────────
// Groq exposes an OpenAI-compatible API — same SDK, different baseURL + key.

const ai = new OpenAI({
  apiKey: config.groq_api_key,
  baseURL: 'https://api.groq.com/openai/v1',
});

const GROQ_MODEL = 'llama-3.3-70b-versatile';

// ─── Difficulty prompt map ─────────────────────────────────────────────────────

const DIFFICULTY_GUIDE: Record<DifficultyLevel, string> = {
  beginner:
    'Focus on basic definitions, simple facts, and fundamental concepts. Questions should be easy and straightforward.',
  intermediate:
    'Test conceptual understanding and practical application. Avoid purely definitional questions. Add some nuance.',
  advanced:
    'Challenge deep understanding, edge cases, tricky comparisons, and analysis-level thinking. Questions should require reasoning.',
};

// ─── Text explanation ─────────────────────────────────────────────────────────

export const getDetailedExplanation = async (topic: string): Promise<string> => {
  const prompt = `
You are an expert educator. Provide a clear, thorough explanation of: "${topic}"

Structure your response in markdown:
## Overview
(2-3 sentence summary)

## Key Concepts
(bullet points of the main ideas)

## Detailed Explanation
(in-depth content with examples)

## Common Use Cases / Applications
(real-world relevance)

## Quick Summary
(1 paragraph recap)

Be accurate, beginner-friendly, and use examples. Use proper markdown formatting.
  `.trim();

  try {
    const response = await retryOnOverload(() =>
      ai.chat.completions.create({
        model: GROQ_MODEL,
        messages: [{ role: 'user', content: prompt }],
      })
    );

    const text = response.choices[0]?.message?.content;
    if (!text) throw new CustomError('Empty AI response.', 500);
    return text;
  } catch (error: any) {
    console.log('Error generating explanation:', error); // Debug log for AI errors
    if (error instanceof CustomError) throw error;
    throw new CustomError('Failed to generate explanation.', 500);
  }
};

// ─── YouTube video links ───────────────────────────────────────────────────────

export interface IVideoResult {
  title: string;
  videoId: string;
  url: string;
  thumbnail: string;
}

export const getVideoLinks = async (
  topic: string,
  maxResults = 10
): Promise<IVideoResult[]> => {
  if (!config.YOUTUBE_API_KEY) throw new CustomError('YouTube API key not configured.', 500);

  const youtube = google.youtube({ version: 'v3', auth: config.YOUTUBE_API_KEY });

  try {
    const response = await youtube.search.list({
      part: ['id', 'snippet'],
      q: `${topic} tutorial explained`,
      maxResults,
      type: ['video'],
      videoEmbeddable: 'true',
      relevanceLanguage: 'en',
      order: 'relevance',
    });

    console.log(`ai service: Fetched ${response.data.items?.length || 0} YouTube results for topic: "${topic}"`); // Debug log

    const items = response.data.items || [];
    return items
      .filter((item: any) => item.id?.videoId)
      .map((item: any) => ({
        title: item.snippet.title,
        videoId: item.id.videoId,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        thumbnail: item.snippet.thumbnails?.medium?.url || '',
      }));
  } catch (error: any) {
    console.log('Error fetching YouTube videos:', error); // Debug log for YouTube API errors
    throw new CustomError('Failed to fetch YouTube videos.', 500);
  }
};

// ─── Reference links (Wikipedia, docs, practice) ───────────────────────────────

export interface IReferenceLink {
  title: string;
  url: string;
  source: string; // e.g. "Wikipedia", "LeetCode", "GeeksforGeeks", "Official Docs"
}

export const getReferenceLinks = async (topic: string): Promise<IReferenceLink[]> => {
  console.log(`ai service: Generating reference links for topic: "${topic}"`); // Debug log
  
  const prompt = `
Suggest 5-6 high-quality reference links for learning and practicing: "${topic}"

Include a mix where relevant:
- Wikipedia article (if applicable)
- Official documentation
- GeeksforGeeks or similar tutorial article
- LeetCode or practice platform (only if topic is programming/DSA related, skip otherwise)
- One well-known blog/reference site

Respond ONLY with a valid JSON array, no markdown, no preamble:
[
  { "title": "...", "url": "...", "source": "Wikipedia" }
]

Use only real, well-known URLs (e.g. en.wikipedia.org, leetcode.com, geeksforgeeks.org, official project docs). Do not invent fake URLs.
  `.trim();

  try {
    const response = await retryOnOverload(() =>
      ai.chat.completions.create({
        model: GROQ_MODEL,
        messages: [{ role: 'user', content: prompt }],
      })
    );

    console.log('ai service: Raw AI response for reference links:', response.choices[0]?.message?.content); // Debug log

    const raw = response.choices[0]?.message?.content || '';

    const parsed = extractJsonArray(raw);
    if (!parsed) return [];

    return parsed
      .map((r: any) => ({
        title: String(r.title || '').trim(),
        url: String(r.url || '').trim(),
        source: String(r.source || '').trim(),
      }))
      .filter((r) => r.title && r.url);
  } catch (error) {
    console.log('Error generating reference links:', error);
    return []; // non-fatal — video links can still succeed without these
  }
};

// ─── Quiz question generation ─────────────────────────────────────────────────

export const generateQuestionsByAI = async (
  topic: string,
  numQuestions: number,
  difficulty: DifficultyLevel
): Promise<IQuestionRaw[]> => {
  if (!topic || !numQuestions) throw new CustomError('Invalid input parameters.', 400);

  const prompt = `
You are a professional quiz maker. Generate exactly ${numQuestions} unique multiple-choice questions on: "${topic}"

Difficulty: ${difficulty.toUpperCase()}
${DIFFICULTY_GUIDE[difficulty]}

Rules:
- Each question must have exactly 4 options: A, B, C, D
- The answer must be just the letter: A, B, C, or D
- Add a 1-2 sentence explanation of why the answer is correct
- All options must be plausible – no obviously wrong distractors
- Do NOT repeat questions or options

Respond ONLY with a valid JSON array. No markdown, no preamble, just the array:
[
  {
    "question": "...",
    "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
    "answer": "A",
    "explanation": "..."
  }
]
  `.trim();

  try {
    const response = await retryOnOverload(() =>
      ai.chat.completions.create({
        model: GROQ_MODEL,
        messages: [{ role: 'user', content: prompt }],
      })
    );

    const raw = response.choices[0]?.message?.content || '';
    const parsed = extractJsonArray(raw);

    if (!parsed) {
      throw new CustomError('AI returned invalid JSON for questions.', 500);
    }

    const validQuestions = parsed
      .map(sanitizeQuestion)
      .filter((q): q is IQuestionRaw => q !== null);

    // At scale, a handful of malformed questions shouldn't fail the whole
    // request — only fail if too few survived to be usable.
    const minRequired = Math.max(1, Math.ceil(numQuestions * 0.6));
    if (validQuestions.length < minRequired) {
      console.warn(
        `Quiz gen: only ${validQuestions.length}/${numQuestions} valid questions for "${topic}"`
      );
      throw new CustomError('AI returned too few valid questions.', 500);
    }

    if (validQuestions.length < numQuestions) {
      console.warn(
        `Quiz gen: dropped ${numQuestions - validQuestions.length} malformed question(s) for "${topic}"`
      );
    }

    return validQuestions.slice(0, numQuestions);
  } catch (error: any) {
    if (error instanceof CustomError) throw error;
    throw new CustomError('Failed to generate questions via AI.', 500);
  }
};

// ─── JSON extraction & validation helpers ──────────────────────────────────────

/**
 * Pulls a JSON array out of a raw LLM response even if it's wrapped in
 * markdown fences, preamble text, or trailing commentary.
 */
const extractJsonArray = (raw: string): any[] | null => {
  let text = raw.trim();
  text = text.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();

  // Direct parse first — cheapest path, works most of the time.
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // fall through to bracket-matching below
  }

  // Fallback: find the first '[' and its matching ']' and parse just that slice —
  // handles cases where the model adds stray text before/after the array.
  const start = text.indexOf('[');
  const end = text.lastIndexOf(']');
  if (start !== -1 && end !== -1 && end > start) {
    try {
      const parsed = JSON.parse(text.slice(start, end + 1));
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return null;
    }
  }

  return null;
};

const VALID_ANSWERS = new Set(['A', 'B', 'C', 'D']);

/**
 * Validates and normalizes a single raw question object.
 * Returns null (rather than throwing) so one bad question doesn't
 * take down the whole batch.
 */
const sanitizeQuestion = (q: any): IQuestionRaw | null => {
  if (!q || typeof q !== 'object') return null;

  const question = String(q.question || '').trim();
  const options = Array.isArray(q.options) ? q.options.map((o: any) => String(o).trim()) : [];
  const answer = String(q.answer || '').trim().toUpperCase().charAt(0);
  const explanation = String(q.explanation || '').trim();

  if (!question || options.length !== 4 || !VALID_ANSWERS.has(answer)) {
    return null;
  }

  return { question, options, answer, explanation };
};

// ─── Daily challenge topic picker ─────────────────────────────────────────────

export const getDailyChallengeTopic = async (): Promise<string> => {
  const prompt = `
Give me one interesting educational quiz topic suitable for a daily challenge.
It should be specific enough for 5 multiple-choice questions but broad enough to be interesting.
Examples: "The Human Digestive System", "Basic Python Data Types", "World War II Causes", "Introduction to Machine Learning"
Respond with ONLY the topic name. No explanation, no quotes, no punctuation.
  `.trim();

  try {
    const response = await retryOnOverload(() =>
      ai.chat.completions.create({
        model: 'llama-3.1-8b-instant', // lighter/faster model — simple single-line task
        messages: [{ role: 'user', content: prompt }],
      })
    );
    return (response.choices[0]?.message?.content || 'General Knowledge').trim();
  } catch {
    return 'General Knowledge';
  }
};

// ─── Health check ───────────────────────────────────────────────────────────────

/**
 * Verifies the Groq API key/connection works by listing available models.
 * Call this once at server startup (non-blocking) to catch bad keys or
 * network/DNS issues early instead of on the first user request.
 */
export const checkGroqConnection = async (): Promise<boolean> => {
  try {
    const models = await ai.models.list();
    const count = models.data?.length ?? 0;
    console.log(`✅ Groq initialized successfully — ${count} models available.`);
    return true;
  } catch (error: any) {
    const status = error?.status || error?.response?.status;
    console.error(
      `❌ Groq initialization failed${status ? ` (status ${status})` : ''}:`,
      error?.message || error
    );
    return false;
  }
};

// ─── Retry helper ───────────────────────────────────────────────────────────────

const retryOnOverload = async <T>(
  fn: () => Promise<T>,
  retries = 3,
  delayMs = 2000
): Promise<T> => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err: any) {
      const status = err?.status || err?.response?.status;
      const isRetryable = status === 503 || status === 429;
      if (isRetryable && i < retries - 1) {
        console.warn(`Groq ${status} — retrying in ${delayMs}ms (attempt ${i + 1}/${retries})`);
        await new Promise((res) => setTimeout(res, delayMs));
      } else {
        throw err;
      }
    }
  }
  throw new CustomError('AI service unavailable after retries.', 503);
};

// Backend/src/models/syllabus.model.ts
import mongoose, { Document, Model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { ContentType } from '../types';

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface IVideoLink {
  title: string;
  videoId: string;
  url: string;
  thumbnail: string;
}

export interface IReferenceLink {
  title: string;
  url: string;
  source: string;
}

export interface ISyllabus extends Document {
  syllabusId: string;
  userId: string;
  topic: string;
  content: string;
  videoLinks: IVideoLink[];
  referenceLinks: IReferenceLink[];
  contentType: ContentType;
  createdAt: Date;
  updatedAt: Date;
}



export interface ISyllabusModel extends Model<ISyllabus> { }

// ─── Sub-schema ───────────────────────────────────────────────────────────────


const referenceLinkSchema = new Schema<IReferenceLink>(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    source: { type: String, default: '' },
  },
  { _id: false }
);


const videoLinkSchema = new Schema<IVideoLink>(
  {
    title: { type: String, required: true },
    videoId: { type: String, required: true },
    url: { type: String, required: true },
    thumbnail: { type: String, default: '' },
  },
  { _id: false }
);

// ─── Main schema ──────────────────────────────────────────────────────────────

const syllabusSchema = new Schema<ISyllabus, ISyllabusModel>(
  {
    syllabusId: {
      type: String,
      default: () => uuidv4(),
      unique: true,
      index: true,
    },
    userId: { type: String, ref: 'User', required: true },
    topic: { type: String, required: true, trim: true },
    content: { type: String, default: '' },
    videoLinks: { type: [videoLinkSchema], default: [] },
    referenceLinks: { type: [referenceLinkSchema], default: [] },
    contentType: {
      type: String,
      enum: ['text', 'video', 'both'],
      default: 'text',
    },
  },
  { timestamps: true }
);

// syllabus.model.ts
syllabusSchema.virtual('bookmarkedSyllabus', {
  ref: 'Syllabus',
  localField: 'syllabusId',
  foreignField: 'syllabusId',
  justOne: true,
});

// ─── Indexes ──────────────────────────────────────────────────────────────────

syllabusSchema.index({ userId: 1 });
syllabusSchema.index({ userId: 1, topic: 1 });
syllabusSchema.index({ topic: 'text' });
syllabusSchema.index({ createdAt: -1 });

// ─── Export ───────────────────────────────────────────────────────────────────

const SyllabusModel = mongoose.model<ISyllabus, ISyllabusModel>('Syllabus', syllabusSchema);
export default SyllabusModel;

