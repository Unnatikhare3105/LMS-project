//backend/src/repositories/quiz.repository.ts

import mongoose from 'mongoose';
import QuizModel, { IQuiz, IQuestion } from '../models/quiz.model';
import { DifficultyLevel } from '../types';

// ─── Reads ────────────────────────────────────────────────────────────────────

export const findQuizByQuizId = async (quizId: string): Promise<IQuiz | null> => {
  return QuizModel.findOne({ quizId }).exec();
};

export const findQuizByObjectId = async (
  id: string | mongoose.Types.ObjectId
): Promise<IQuiz | null> => {
  return QuizModel.findById(id).exec();
};

export const findAllQuizzesByUserId = async (
  userId: string
): Promise<IQuiz[]> => {
  return QuizModel.find({ userId })
    .select('quizId topic difficulty totalQuestions score completedAt createdAt')
    .sort({ createdAt: -1 })
    .exec();
};

export const findQuizzesBySyllabusId = async (
  syllabusId: string
): Promise<IQuiz[]> => {
  return QuizModel.find({ syllabusId })
    .select('quizId topic difficulty totalQuestions score completedAt createdAt')
    .sort({ createdAt: -1 })
    .exec();
};

export const findQuizzesByUserAndDifficulty = async (
  userId: string,
  difficulty: DifficultyLevel
): Promise<IQuiz[]> => {
  return QuizModel.find({ userId, difficulty }).sort({ createdAt: -1 }).exec();
};

export const getLeaderboard = async (limit = 10) => {
  return QuizModel.aggregate([
    { $match: { score: { $ne: null } } },
    {
      $group: {
        _id: '$userId',
        totalScore: { $sum: '$score' },
        quizCount: { $sum: 1 },
        avgScore: { $avg: '$score' },
        bestScore: { $max: '$score' },
      },
    },
    { $sort: { totalScore: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: 'userId',
        as: 'user',
      },

    },
    { $unwind: '$user' },
    {
      $project: {
        totalScore: 1,
        quizCount: 1,
        bestScore: 1,
        avgScore: { $round: ['$avgScore', 1] },
        'user.name': 1,
        'user.userId': 1,
      },
    },
  ]);
};

// ─── Writes ───────────────────────────────────────────────────────────────────

export const createQuiz = async (data: {
  userId: string;
  syllabusId: string;
  topic: string;
  difficulty: DifficultyLevel;
  questions: IQuestion[];
}): Promise<IQuiz> => {
  return QuizModel.create({ ...data, totalQuestions: data.questions.length });
};

export const submitQuizResult = async (
  quizId: string,
  score: number,
  timeTakenSeconds: number
): Promise<IQuiz | null> => {
  return QuizModel.findOneAndUpdate(
    { quizId },
    { $set: { score, timeTakenSeconds, completedAt: new Date() } },
    { new: true }
  ).exec();
};

export const deleteQuizByQuizId = async (quizId: string): Promise<boolean> => {
  const result = await QuizModel.findOneAndDelete({ quizId }).exec();
  return !!result;
};