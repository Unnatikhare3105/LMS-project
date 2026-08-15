//backend/src/middlewares/rateLimiter.middleware.ts

import rateLimit from 'express-rate-limit';

// ─── General API limiter ───────────────────────────────────────────────────
// Normal CRUD routes: profile, bookmarks, quiz history, leaderboard, etc.
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again in a few minutes.' },
});

// ─── AI limiter ─────────────────────────────────────────────────────────────
// Only for routes that call Gemini/Groq: syllabus generation, quiz generation,
// daily challenge. Much tighter since these are expensive (quota + latency).
export const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'AI generation limit reached. Please try again in a few minutes.' },
  // Key by authenticated user instead of raw IP — one user can't burn
  // another user's quota if they're behind the same NAT/IP.
  keyGenerator: (req) => (req as any).user?._id?.toString() || req.ip,
});

// ─── Auth limiter ───────────────────────────────────────────────────────────
// login/register/OTP routes — stops brute-force and OTP-spam abuse.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts. Please try again later.' },
});