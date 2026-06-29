import { z } from 'zod';
import { BaseEntity } from '@chessome/types';

export const BaseEntitySchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
}) satisfies z.ZodType<BaseEntity>;
