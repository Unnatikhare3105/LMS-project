// client/src/validations/quiz.validation.ts

import { z } from 'zod';

export const generateQuizSchema = z.object({
  numQuestions: z
    .number()
    .int()
    .min(1, 'Must generate at least 1 question')
    .max(30, 'Cannot generate more than 30 questions'),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced'] as const, {
    error: 'Difficulty must be beginner, intermediate, or advanced',
  }),
});

export const submitQuizSchema = z.object({
  score: z.number().min(0, 'Score cannot be negative'),
  timeTakenSeconds: z.number().positive('Time taken must be positive'),
});

export type GenerateQuizInput = z.infer<typeof generateQuizSchema>;
export type SubmitQuizInput = z.infer<typeof submitQuizSchema>;