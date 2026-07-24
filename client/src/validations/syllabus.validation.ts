// client/src/validations/syllabus.validation.ts

import { z } from 'zod';

export const generateTextSchema = z.object({
  topic: z.string().trim().min(2, 'Topic must be at least 2 characters'),
});

export const generateVideoSchema = z.object({
  topic: z.string().trim().min(2, 'Topic must be at least 2 characters'),
});

export const updateSyllabusSchema = z.object({
  content: z.string().min(1, 'Content is required'),
});

export type GenerateTextInput = z.infer<typeof generateTextSchema>;
export type GenerateVideoInput = z.infer<typeof generateVideoSchema>;
export type UpdateSyllabusInput = z.infer<typeof updateSyllabusSchema>;