import { z } from 'zod';
import { EngineEvaluation, EvaluationScore, EngineInfo, EngineOption } from '@chessome/types';

export const EvaluationScoreSchema = z.object({
  type: z.enum(['cp', 'mate']),
  value: z.number(),
}) satisfies z.ZodType<EvaluationScore>;

export const EngineEvaluationSchema = z.object({
  fen: z.string(),
  depth: z.number().int().min(1),
  score: EvaluationScoreSchema,
  pv: z.array(z.string()),
  nodes: z.number().int().min(0),
  nps: z.number().int().min(0),
  time: z.number().int().min(0),
}) satisfies z.ZodType<EngineEvaluation>;

export const EngineOptionSchema = z.object({
  name: z.string(),
  type: z.enum(['spin', 'check', 'combo', 'button', 'string']),
  default: z.union([z.string(), z.number(), z.boolean()]).optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  vars: z.array(z.string()).optional(),
}) satisfies z.ZodType<EngineOption>;

export const EngineInfoSchema = z.object({
  name: z.string(),
  author: z.string(),
  version: z.string(),
  options: z.array(EngineOptionSchema),
}) satisfies z.ZodType<EngineInfo>;
