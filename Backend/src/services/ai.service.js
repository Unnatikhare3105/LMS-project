"use strict";
//Backend/src/services/ai.service.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkGroqConnection = exports.getDailyChallengeTopic = exports.generateQuestionsByAI = exports.getReferenceLinks = exports.getVideoLinks = exports.getDetailedExplanation = void 0;
const openai_1 = __importDefault(require("openai"));
const googleapis_1 = require("googleapis");
const config_1 = __importDefault(require("../config/config"));
const customError_1 = __importDefault(require("../utils/customError"));
// ─── Init ─────────────────────────────────────────────────────────────────────
// Groq exposes an OpenAI-compatible API — same SDK, different baseURL + key.
const ai = new openai_1.default({
    apiKey: config_1.default.groq_api_key,
    baseURL: 'https://api.groq.com/openai/v1',
});
const GROQ_MODEL = 'llama-3.3-70b-versatile';
// ─── Difficulty prompt map ─────────────────────────────────────────────────────
const DIFFICULTY_GUIDE = {
    beginner: 'Focus on basic definitions, simple facts, and fundamental concepts. Questions should be easy and straightforward.',
    intermediate: 'Test conceptual understanding and practical application. Avoid purely definitional questions. Add some nuance.',
    advanced: 'Challenge deep understanding, edge cases, tricky comparisons, and analysis-level thinking. Questions should require reasoning.',
};
// ─── Text explanation ─────────────────────────────────────────────────────────
const getDetailedExplanation = async (topic) => {
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
        const response = await retryOnOverload(() => ai.chat.completions.create({
            model: GROQ_MODEL,
            messages: [{ role: 'user', content: prompt }],
        }));
        const text = response.choices[0]?.message?.content;
        if (!text)
            throw new customError_1.default('Empty AI response.', 500);
        return text;
    }
    catch (error) {
        console.log('Error generating explanation:', error); // Debug log for AI errors
        if (error instanceof customError_1.default)
            throw error;
        throw new customError_1.default('Failed to generate explanation.', 500);
    }
};
exports.getDetailedExplanation = getDetailedExplanation;
const getVideoLinks = async (topic, maxResults = 10) => {
    if (!config_1.default.YOUTUBE_API_KEY)
        throw new customError_1.default('YouTube API key not configured.', 500);
    const youtube = googleapis_1.google.youtube({ version: 'v3', auth: config_1.default.YOUTUBE_API_KEY });
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
            .filter((item) => item.id?.videoId)
            .map((item) => ({
            title: item.snippet.title,
            videoId: item.id.videoId,
            url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
            thumbnail: item.snippet.thumbnails?.medium?.url || '',
        }));
    }
    catch (error) {
        console.log('Error fetching YouTube videos:', error); // Debug log for YouTube API errors
        throw new customError_1.default('Failed to fetch YouTube videos.', 500);
    }
};
exports.getVideoLinks = getVideoLinks;
const getReferenceLinks = async (topic) => {
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
        const response = await retryOnOverload(() => ai.chat.completions.create({
            model: GROQ_MODEL,
            messages: [{ role: 'user', content: prompt }],
        }));
        console.log('ai service: Raw AI response for reference links:', response.choices[0]?.message?.content); // Debug log
        const raw = response.choices[0]?.message?.content || '';
        const parsed = extractJsonArray(raw);
        if (!parsed)
            return [];
        return parsed
            .map((r) => ({
            title: String(r.title || '').trim(),
            url: String(r.url || '').trim(),
            source: String(r.source || '').trim(),
        }))
            .filter((r) => r.title && r.url);
    }
    catch (error) {
        console.log('Error generating reference links:', error);
        return []; // non-fatal — video links can still succeed without these
    }
};
exports.getReferenceLinks = getReferenceLinks;
// ─── Quiz question generation ─────────────────────────────────────────────────
const generateQuestionsByAI = async (topic, numQuestions, difficulty) => {
    if (!topic || !numQuestions)
        throw new customError_1.default('Invalid input parameters.', 400);
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
        const response = await retryOnOverload(() => ai.chat.completions.create({
            model: GROQ_MODEL,
            messages: [{ role: 'user', content: prompt }],
        }));
        const raw = response.choices[0]?.message?.content || '';
        const parsed = extractJsonArray(raw);
        if (!parsed) {
            throw new customError_1.default('AI returned invalid JSON for questions.', 500);
        }
        const validQuestions = parsed
            .map(sanitizeQuestion)
            .filter((q) => q !== null);
        // At scale, a handful of malformed questions shouldn't fail the whole
        // request — only fail if too few survived to be usable.
        const minRequired = Math.max(1, Math.ceil(numQuestions * 0.6));
        if (validQuestions.length < minRequired) {
            console.warn(`Quiz gen: only ${validQuestions.length}/${numQuestions} valid questions for "${topic}"`);
            throw new customError_1.default('AI returned too few valid questions.', 500);
        }
        if (validQuestions.length < numQuestions) {
            console.warn(`Quiz gen: dropped ${numQuestions - validQuestions.length} malformed question(s) for "${topic}"`);
        }
        return validQuestions.slice(0, numQuestions);
    }
    catch (error) {
        if (error instanceof customError_1.default)
            throw error;
        throw new customError_1.default('Failed to generate questions via AI.', 500);
    }
};
exports.generateQuestionsByAI = generateQuestionsByAI;
// ─── JSON extraction & validation helpers ──────────────────────────────────────
/**
 * Pulls a JSON array out of a raw LLM response even if it's wrapped in
 * markdown fences, preamble text, or trailing commentary.
 */
const extractJsonArray = (raw) => {
    let text = raw.trim();
    text = text.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
    // Direct parse first — cheapest path, works most of the time.
    try {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed))
            return parsed;
    }
    catch {
        // fall through to bracket-matching below
    }
    // Fallback: find the first '[' and its matching ']' and parse just that slice —
    // handles cases where the model adds stray text before/after the array.
    const start = text.indexOf('[');
    const end = text.lastIndexOf(']');
    if (start !== -1 && end !== -1 && end > start) {
        try {
            const parsed = JSON.parse(text.slice(start, end + 1));
            if (Array.isArray(parsed))
                return parsed;
        }
        catch {
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
const sanitizeQuestion = (q) => {
    if (!q || typeof q !== 'object')
        return null;
    const question = String(q.question || '').trim();
    const options = Array.isArray(q.options) ? q.options.map((o) => String(o).trim()) : [];
    const answer = String(q.answer || '').trim().toUpperCase().charAt(0);
    const explanation = String(q.explanation || '').trim();
    if (!question || options.length !== 4 || !VALID_ANSWERS.has(answer)) {
        return null;
    }
    return { question, options, answer, explanation };
};
// ─── Daily challenge topic picker ─────────────────────────────────────────────
const getDailyChallengeTopic = async () => {
    const prompt = `
Give me one interesting educational quiz topic suitable for a daily challenge.
It should be specific enough for 5 multiple-choice questions but broad enough to be interesting.
Examples: "The Human Digestive System", "Basic Python Data Types", "World War II Causes", "Introduction to Machine Learning"
Respond with ONLY the topic name. No explanation, no quotes, no punctuation.
  `.trim();
    try {
        const response = await retryOnOverload(() => ai.chat.completions.create({
            model: 'llama-3.1-8b-instant', // lighter/faster model — simple single-line task
            messages: [{ role: 'user', content: prompt }],
        }));
        return (response.choices[0]?.message?.content || 'General Knowledge').trim();
    }
    catch {
        return 'General Knowledge';
    }
};
exports.getDailyChallengeTopic = getDailyChallengeTopic;
// ─── Health check ───────────────────────────────────────────────────────────────
/**
 * Verifies the Groq API key/connection works by listing available models.
 * Call this once at server startup (non-blocking) to catch bad keys or
 * network/DNS issues early instead of on the first user request.
 */
const checkGroqConnection = async () => {
    try {
        const models = await ai.models.list();
        const count = models.data?.length ?? 0;
        console.log(`✅ Groq initialized successfully — ${count} models available.`);
        return true;
    }
    catch (error) {
        const status = error?.status || error?.response?.status;
        console.error(`❌ Groq initialization failed${status ? ` (status ${status})` : ''}:`, error?.message || error);
        return false;
    }
};
exports.checkGroqConnection = checkGroqConnection;
// ─── Retry helper ───────────────────────────────────────────────────────────────
const retryOnOverload = async (fn, retries = 3, delayMs = 2000) => {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        }
        catch (err) {
            const status = err?.status || err?.response?.status;
            const isRetryable = status === 503 || status === 429;
            if (isRetryable && i < retries - 1) {
                console.warn(`Groq ${status} — retrying in ${delayMs}ms (attempt ${i + 1}/${retries})`);
                await new Promise((res) => setTimeout(res, delayMs));
            }
            else {
                throw err;
            }
        }
    }
    throw new customError_1.default('AI service unavailable after retries.', 503);
};
//# sourceMappingURL=ai.service.js.map