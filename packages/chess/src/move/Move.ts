import { SquareIndex } from '../square';
import { PieceType } from '../piece';
import { MoveFlags } from './MoveFlags';

export interface Move {
  readonly from: SquareIndex;
  readonly to: SquareIndex;
  readonly flags: MoveFlags;
  readonly promotion?: PieceType;
}

export const createMove = (from: SquareIndex, to: SquareIndex, flags: MoveFlags = MoveFlags.None, promotion?: PieceType): Move => ({
  from, to, flags, promotion
});
