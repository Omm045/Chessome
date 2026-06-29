import { Color } from './Color';
import { PieceType } from './PieceType';

export interface Piece {
  readonly type: PieceType;
  readonly color: Color;
}

export const createPiece = (type: PieceType, color: Color): Piece => ({ type, color });

export const isSamePiece = (a: Piece | null, b: Piece | null): boolean => {
  if (a === null && b === null) return true;
  if (a === null || b === null) return false;
  return a.type === b.type && a.color === b.color;
};
