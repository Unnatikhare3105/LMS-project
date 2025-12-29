import express, { Express } from "express";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';

import userRoutes from 'routers/user.routes';
import syllabusRoutes from 'routers/syllabus.routes';
import quizController from 'routers/quiz.routes';

import { connectDB } from 'db/db';

const app: Express = express();

// Database connection
connectDB();

// Middlewares
app.use(morgan('dev'));  // 'dev' better for development
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: 'http://localhost:5173', // तुम्हारा frontend URL
    credentials: true,
  })
);

// Routes
app.use('/user', userRoutes);
app.use('/syllabus', syllabusRoutes);
app.use('/quiz', quizController);

export default app;