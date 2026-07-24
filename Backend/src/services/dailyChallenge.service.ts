// Backend/src/services/dailyChallenge.service.ts

import CustomError from '../utils/customError';
import * as challengeRepo from '../repositories/dailyChallenge.repository';
import * as aiService from './ai.service';
import { IDailyChallenge } from '../models/dailyChallenge.model';

const DAILY_QUESTIONS = 5;

export const getTodayChallenge = async (): Promise<IDailyChallenge> => {
  const today = new Date().toISOString().split('T')[0];

  // Return existing if already generated today
  const existing = await challengeRepo.findChallengeByDate(today);
  if (existing) return existing;

  // Generate fresh challenge
  const topic = await aiService.getDailyChallengeTopic();
  const questions = await aiService.generateQuestionsByAI(topic, DAILY_QUESTIONS, 'intermediate');

  if (!questions.length) throw new CustomError('Failed to generate daily challenge.', 500);

  const normalizedQuestions = questions.map((question) => ({
    ...question,
    explanation: question.explanation ?? '',
  }));

  try {
    return await challengeRepo.createDailyChallenge({ date: today, topic, questions: normalizedQuestions });
  } catch (error: any) {
    if (error.code === 11000) {
      const fresh = await challengeRepo.findChallengeByDate(today);
      if (fresh) return fresh;
    }
    throw error;
  }

};

export const getRecentChallenges = async (limit = 7): Promise<IDailyChallenge[]> => {
  return challengeRepo.getRecentChallenges(limit);
};