// client/src/validations/dailyChallenge.validation.ts

import { z } from 'zod';

export const recentChallengesQuerySchema = z.object({
  limit: z
    .number()
    .int()
    .min(1, 'Limit must be at least 1')
    .max(30, 'Limit cannot exceed 30')
    .optional(),
});

export type RecentChallengesQuery = z.infer<typeof recentChallengesQuerySchema>;