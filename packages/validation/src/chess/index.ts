import { z } from 'zod';
import { PieceColor, PieceType, ChessMove, GameMetadata } from '@chessome/types';

export const PieceColorSchema = z.nativeEnum(PieceColor);
export const PieceTypeSchema = z.nativeEnum(PieceType);

export const ChessMoveSchema = z.object({
  from: z.string().length(2),
  to: z.string().length(2),
  promotion: PieceTypeSchema.optional(),
  san: z.string(),
  uci: z.string().min(4).max(5),
}) satisfies z.ZodType<ChessMove>;

export const GameMetadataSchema = z.object({
  white: z.string(),
  black: z.string(),
  date: z.string(),
  result: z.string(),
  eco: z.string().optional(),
  event: z.string().optional(),
}) satisfies z.ZodType<GameMetadata>;
