import { z } from 'zod';
import { EventNames } from '@chessome/events';

export const EventNamesSchema = z.nativeEnum(EventNames);

export const createDomainEventSchema = <T extends z.ZodTypeAny>(payloadSchema: T) => 
  z.object({
    id: z.string().uuid(),
    type: z.string(),
    timestamp: z.date(),
    aggregateId: z.string(),
    payload: payloadSchema,
    version: z.number().int().min(1),
  });
