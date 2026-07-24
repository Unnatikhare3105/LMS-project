// client/src/validations/bookmark.validation.ts

import { z } from 'zod';

export const addBookmarkSchema = z.object({
  note: z.string().optional(),
});

export const updateBookmarkNoteSchema = z.object({
  note: z.string().min(0, 'Note is required'),
});

export type AddBookmarkInput = z.infer<typeof addBookmarkSchema>;
export type UpdateBookmarkNoteInput = z.infer<typeof updateBookmarkNoteSchema>;