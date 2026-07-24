// client/src/services/dailyChallenge.service.ts

import { apiClient } from '@/src/lib/axios';

export const dailyChallengeService = {
  getToday: () =>
    apiClient.get('/daily-challenge/today'),

  getRecent: (limit?: number) =>
    apiClient.get('/daily-challenge/recent', { params: { limit } }),
};

