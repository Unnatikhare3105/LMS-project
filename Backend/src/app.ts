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
import { generalLimiter } from '@middlewares/rateLimiter.middleware';


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

app.use(generalLimiter);

app.get(
  '/health',
  (_req, res) => res.json({
    success: true,
    message: 'LMS Server healthy.'
  }));

checkGroqConnection()

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


app.use(notFound);
app.use(errorHandler);

export default app;

