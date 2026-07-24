

//backend/src/repositories/dailyChallenge.repository.ts

import DailyChallengeModel, { IDailyChallenge } from '../models/dailyChallenge.model';
import { IQuestion } from '../models/quiz.model';

// ─── Reads ────────────────────────────────────────────────────────────────────

export const findChallengeByDate = async (date: string): Promise<IDailyChallenge | null> => {
  return DailyChallengeModel.findOne({ date }).exec();
};

export const findTodayChallenge = async (): Promise<IDailyChallenge | null> => {
  const today = new Date().toISOString().split('T')[0];
  return findChallengeByDate(today);
};

export const getRecentChallenges = async (limit = 7): Promise<IDailyChallenge[]> => {
  return DailyChallengeModel.find()
    .sort({ date: -1 })
    .limit(limit)
    .select('dailyChallengeId date topic totalQuestions')
    .exec();
};

// ─── Writes ───────────────────────────────────────────────────────────────────

export const createDailyChallenge = async (data: {
  date: string;
  topic: string;
  questions: IQuestion[];
}): Promise<IDailyChallenge> => {
  return DailyChallengeModel.create({ ...data, totalQuestions: data.questions.length });
};