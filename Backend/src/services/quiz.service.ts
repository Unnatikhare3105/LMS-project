//backend/src/services/quiz.service.ts

import mongoose from 'mongoose';
import CustomError from '../utils/customError';
import * as quizRepo from '../repositories/quiz.repository';
import * as syllabusRepo from '../repositories/syllabus.repository';
import * as userRepo from '../repositories/user.repository';
import * as aiService from './ai.service';
import { IQuiz } from '../models/quiz.model';
import { IGenerateQuestionsInput } from '../types';

// ─── Generate quiz ────────────────────────────────────────────────────────────

export const generateQuiz = async (input: IGenerateQuestionsInput): Promise<IQuiz> => {
  const { userId, topicPublicId, topicName, numQuestions, difficulty } = input;

  // Resolve publicId → internal ObjectId
  const syllabusObjId = await syllabusRepo.getObjectIdBySyllabusId(topicPublicId);
  if (!syllabusObjId) throw new CustomError('Topic not found.', 404);

  const questions = await aiService.generateQuestionsByAI(topicName, numQuestions, difficulty);
  if (!questions.length) throw new CustomError('Failed to generate questions.', 500);

  const quizQuestions = questions.map((question) => ({
    ...question,
    explanation: question.explanation ?? '',
  }));

  const quiz = await quizRepo.createQuiz({
    userId,
    syllabusId: topicPublicId,
    topic: topicName,
    difficulty,
    questions: quizQuestions,
  });

  // Non-blocking activity tracking
  userRepo.recordActivity(userId).catch(() => {});
  userRepo.incrementQuizCount(userId).catch(() => {});

  return quiz;
};

// ─── Submit result ────────────────────────────────────────────────────────────

export const submitQuiz = async (
  publicId: string,
  score: number,
  timeTakenSeconds: number,
  userId: string
): Promise<IQuiz> => {
  const existing = await quizRepo.findQuizByQuizId(publicId);
  if (!existing) throw new CustomError('Quiz not found.', 404);
  if (existing.userId.toString() !== userId) throw new CustomError('Forbidden.', 403);
  const updated = await quizRepo.submitQuizResult(publicId, score, timeTakenSeconds);
  if (!updated) throw new CustomError('Quiz not found.', 404);
  return updated;
};

// ─── Reads ────────────────────────────────────────────────────────────────────

export const getAllQuizzes = async (userId: string): Promise<IQuiz[]> => {
  const quizzes = await quizRepo.findAllQuizzesByUserId(userId);
  if (!quizzes.length) throw new CustomError('No quizzes found.', 404);
  return quizzes;
};

export const getQuizzesByTopic = async (topicPublicId: string): Promise<IQuiz[]> => {
  const syllabusObjId = await syllabusRepo.getObjectIdBySyllabusId(topicPublicId);
  if (!syllabusObjId) throw new CustomError('Topic not found.', 404);

  const quizzes = await quizRepo.findQuizzesBySyllabusId(topicPublicId);
  if (!quizzes.length) throw new CustomError('No quizzes found for this topic.', 404);
  return quizzes;
};

export const getQuizByPublicId = async (publicId: string, userId: string): Promise<IQuiz> => {
  const quiz = await quizRepo.findQuizByQuizId(publicId);
  if (!quiz) throw new CustomError('Quiz not found.', 404);
  if (quiz.userId.toString() !== userId) throw new CustomError('Forbidden.', 403);
  return quiz;
};

export const getLeaderboard = async (limit = 10) => {
  return quizRepo.getLeaderboard(limit);
};

export const deleteQuiz = async (publicId: string, userId: string): Promise<void> => {
  const existing = await quizRepo.findQuizByQuizId(publicId);
  if (!existing) throw new CustomError('Quiz not found.', 404);
  if (existing.userId.toString() !== userId) throw new CustomError('Forbidden.', 403);
  await quizRepo.deleteQuizByQuizId(publicId);
};