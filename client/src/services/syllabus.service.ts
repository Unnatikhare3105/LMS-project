// client/src/services/syllabus.service.ts

import { apiClient, aiClient } from '@/src/lib/axios';

export const syllabusService = {

  generateFull: (topic: string) =>
  aiClient.post('/syllabus/generate', { topic }),
  
  generateText: (topic: string) =>
    aiClient.post('/syllabus/generate/text', { topic }),

  generateVideo: (topic: string) =>
    aiClient.post('/syllabus/generate/video', { topic }),

  getAllTopics: () =>
    apiClient.get('/syllabus'),

  getById: (syllabusId: string) =>
    apiClient.get(`/syllabus/${syllabusId}`),

  update: (syllabusId: string, content: string) =>
    apiClient.put(`/syllabus/${syllabusId}`, { content }),

  delete: (syllabusId: string) =>
    apiClient.delete(`/syllabus/${syllabusId}`),
};