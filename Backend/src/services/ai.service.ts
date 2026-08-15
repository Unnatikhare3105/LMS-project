//Backend/src/services/ai.service.ts

import OpenAI from 'openai';
import { google } from 'googleapis';
import config from '../config/config';
import CustomError from '../utils/customError';
import { DifficultyLevel, IQuestionRaw } from '../types';

// ─── Init ─────────────────────────────────────────────────────────────────────

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
    
    return [];
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

  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // fall through to bracket-matching below

  }

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