//backend/src/controllers/dailyChallenge.controller.ts

import { Request, Response, NextFunction } from 'express';
import * as challengeService from '../services/dailyChallenge.service';
import DailyChallengeModel from '@models/dailyChallenge.model';

export const getTodayChallengeController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const challenge = await challengeService.getTodayChallenge();
    res.status(200).json({
      success: true,
      data: {
        dailyChallengeId: challenge.dailyChallengeId,
        date: challenge.date,
        topic: challenge.topic,
        totalQuestions: challenge.totalQuestions,
        questions: challenge.questions,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getRecentChallengesController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const limit = Math.min(Number(req.query.limit) || 7, 30);
    const challenges = await challengeService.getRecentChallenges(limit);
    res.status(200).json({ success: true, data: challenges });
  } catch (error) {
    next(error);
  }
};