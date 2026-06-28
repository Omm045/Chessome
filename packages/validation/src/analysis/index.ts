import { z } from 'zod';
import { MoveClassification, CloudAnalysisJob, MoveReview, GameReview } from '@chessome/types';

export const MoveClassificationSchema = z.nativeEnum(MoveClassification);

export const MoveReviewSchema = z.object({
  fen: z.string(),
  move: z.string(),
  classification: MoveClassificationSchema,
  evalBefore: z.number(),
  evalAfter: z.number(),
  accuracy: z.number().min(0).max(100),
  bestMove: z.string(),
}) satisfies z.ZodType<MoveReview>;

export const CloudAnalysisJobSchema = z.object({
  jobId: z.string().uuid(),
  gameId: z.string().uuid(),
  fen: z.string(),
  depth: z.number().int().min(1).max(99),
  status: z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED']),
  progress: z.number().min(0).max(100).optional(),
  result: z.array(MoveReviewSchema).optional(),
}) satisfies z.ZodType<CloudAnalysisJob>;

export const GameReviewSchema = z.object({
  gameId: z.string().uuid(),
  overallAccuracyWhite: z.number().min(0).max(100),
  overallAccuracyBlack: z.number().min(0).max(100),
  moves: z.array(MoveReviewSchema),
}) satisfies z.ZodType<GameReview>;
