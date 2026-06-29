import { z } from 'zod';
import { ApiError, ApiMeta, PaginatedRequest } from '@chessome/types';

export const ApiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.unknown().optional(),
}) satisfies z.ZodType<ApiError>;

export const ApiMetaSchema = z.object({
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
  total: z.number().int().min(0).optional(),
  hasNextPage: z.boolean().optional(),
}) satisfies z.ZodType<ApiMeta>;

export const PaginatedRequestSchema = z.object({
  page: z.number().int().min(1),
  limit: z.number().int().min(1).max(100),
}) satisfies z.ZodType<PaginatedRequest>;

// Since ApiResponse relies on generics which Zod doesn't support dynamically, 
// we expose a factory function for success responses.
export const createApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) => 
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: ApiErrorSchema.optional(),
    meta: ApiMetaSchema.optional(),
  });
