//backend/src/controllers/quiz.controller.ts

import { Request, Response, NextFunction } from 'express';
import CustomError from '../utils/customError';
import * as quizService from '../services/quiz.service';
import * as syllabusRepo from '../repositories/syllabus.repository';
import { DifficultyLevel } from '../types';

const VALID_DIFFICULTIES: DifficultyLevel[] = ['beginner', 'intermediate', 'advanced'];

export const generateQuizController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { syllabusId } = req.params; // UUID
    const { numQuestions, difficulty } = req.body;

    if (!syllabusId) return next(new CustomError('Syllabus ID is required.', 400));

    if (!numQuestions || typeof numQuestions !== 'number' || numQuestions < 1 || numQuestions > 30) {
      return next(new CustomError('numQuestions must be between 1 and 30.', 400));
    }

    if (!difficulty || !VALID_DIFFICULTIES.includes(difficulty)) {
      return next(
        new CustomError(`difficulty must be one of: ${VALID_DIFFICULTIES.join(', ')}.`, 400)
      );
    }

    const syllabus = await syllabusRepo.findSyllabusBySyllabusId(syllabusId);
    if (!syllabus) return next(new CustomError('Topic not found.', 404));

    const quiz = await quizService.generateQuiz({
      userId: req.user.userId,
      topicPublicId: syllabusId,
      topicName: syllabus.topic,
      numQuestions,
      difficulty,
    });

    res.status(201).json({
      success: true,
      message: 'Quiz generated successfully.',
      data: {
        quizId: quiz.quizId,
        topic: quiz.topic,
        difficulty: quiz.difficulty,
        totalQuestions: quiz.totalQuestions,
        questions: quiz.questions,
        createdAt: quiz.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const submitQuizController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { quizId } = req.params; // UUID
    const { score, timeTakenSeconds } = req.body;

    if (!quizId) return next(new CustomError('Quiz ID is required.', 400));
    if (score === undefined || score === null) return next(new CustomError('Score is required.', 400));
    if (!timeTakenSeconds) return next(new CustomError('timeTakenSeconds is required.', 400));

    const quiz = await quizService.submitQuiz(quizId, Number(score), Number(timeTakenSeconds), req.user.userId);
    res.status(200).json({
      success: true,
      message: 'Quiz submitted.',
      data: {
        quizId: quiz.quizId,
        topic: quiz.topic,
        difficulty: quiz.difficulty,
        score: quiz.score,
        totalQuestions: quiz.totalQuestions,
        timeTakenSeconds: quiz.timeTakenSeconds,
        completedAt: quiz.completedAt,
        questions: quiz.questions,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllQuizzesController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const quizzes = await quizService.getAllQuizzes(req.user.userId);
    res.status(200).json({ success: true, data: quizzes });
  } catch (error) {
    next(error);
  }
};

export const getQuizzesByTopicController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { syllabusId } = req.params; // UUID
    if (!syllabusId) return next(new CustomError('Syllabus ID is required.', 400));

    const quizzes = await quizService.getQuizzesByTopic(syllabusId);
    res.status(200).json({ success: true, data: quizzes });
  } catch (error) {
    next(error);
  }
};

export const getQuizByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { quizId } = req.params; // UUID
    if (!quizId) return next(new CustomError('Quiz ID is required.', 400));

    const quiz = await quizService.getQuizByPublicId(quizId, req.user.userId);
    res.status(200).json({ success: true, data: quiz });
  } catch (error) {
    next(error);
  }
};

export const getLeaderboardController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const limit = Math.min(Number(req.query.limit) || 10, 50);
    const leaderboard = await quizService.getLeaderboard(limit);
    res.status(200).json({ success: true, data: leaderboard });
  } catch (error) {
    next(error);
  }
};

export const deleteQuizController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { quizId } = req.params; // UUID
    if (!quizId) return next(new CustomError('Quiz ID is required.', 400));

    await quizService.deleteQuiz(quizId, req.user.userId);
    res.status(200).json({ success: true, message: 'Quiz deleted.' });
  } catch (error) {
    next(error);
  }
};