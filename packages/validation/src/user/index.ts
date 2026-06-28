import { z } from 'zod';
import { User, UserPreferences, UserStats } from '@chessome/types';
import { BaseEntitySchema } from '../common';

export const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  boardStyle: z.string(),
  pieceSet: z.string(),
  defaultEngineDepth: z.number().int().min(1).max(99),
}) satisfies z.ZodType<UserPreferences>;

export const UserStatsSchema = z.object({
  gamesImported: z.number().int().min(0),
  gamesAnalyzed: z.number().int().min(0),
  averageAccuracy: z.number().min(0).max(100),
}) satisfies z.ZodType<UserStats>;

export const UserSchema = BaseEntitySchema.extend({
  email: z.string().email(),
  username: z.string().min(3).max(50),
  avatarUrl: z.string().url().optional(),
  preferences: UserPreferencesSchema,
  stats: UserStatsSchema,
}) satisfies z.ZodType<User>;
