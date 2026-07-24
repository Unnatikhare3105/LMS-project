// client/src/services/bookmark.service.ts

import { apiClient } from '@/src/lib/axios';

export const bookmarkService = {
  add: (syllabusId: string, note?: string) =>
    apiClient.post(`/bookmarks/${syllabusId}`, { note }),

  getAll: () =>
    apiClient.get('/bookmarks'),

  updateNote: (bookmarkId: string, note: string) =>
    apiClient.patch(`/bookmarks/${bookmarkId}/note`, { note }),

  remove: (bookmarkId: string) =>
    apiClient.delete(`/bookmarks/${bookmarkId}`),
};

