import { z } from 'zod';
import { Session, JwtPayload, UserRole } from '@chessome/types';

export const UserRoleSchema = z.nativeEnum(UserRole);

export const SessionSchema = z.object({
  sessionId: z.string().uuid(),
  userId: z.string().uuid(),
  expiresAt: z.date(),
  ipAddress: z.string().ip().optional(),
  userAgent: z.string().optional(),
}) satisfies z.ZodType<Session>;

export const JwtPayloadSchema = z.object({
  sub: z.string().uuid(),
  email: z.string().email(),
  role: UserRoleSchema,
  iat: z.number().int(),
  exp: z.number().int(),
}) satisfies z.ZodType<JwtPayload>;
