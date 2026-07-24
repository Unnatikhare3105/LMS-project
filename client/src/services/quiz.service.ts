// client/src/services/quiz.service.ts

import { apiClient, aiClient } from '@/src/lib/axios';

export const quizService = {
  generate: (syllabusId: string, numQuestions: number, difficulty: string) =>
    aiClient.post(`/quiz/generate/${syllabusId}`, { numQuestions, difficulty }),

  getAll: () =>
    apiClient.get('/quiz'),

  getByTopic: (syllabusId: string) =>
    apiClient.get(`/quiz/topic/${syllabusId}`),

  getById: (quizId: string) =>
    apiClient.get(`/quiz/${quizId}`),

  submit: (quizId: string, score: number, timeTakenSeconds: number) =>
    apiClient.patch(`/quiz/${quizId}/submit`, { score, timeTakenSeconds }),

  delete: (quizId: string) =>
    apiClient.delete(`/quiz/${quizId}`),

  getLeaderboard: (limit?: number) =>
    apiClient.get('/quiz/leaderboard', { params: { limit } }),
};

