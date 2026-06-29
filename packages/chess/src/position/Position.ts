import { IChessBoard } from '../board';
import { Color } from '../piece';
import { SquareIndex } from '../square';
import { Move } from '../move';
import { CastlingRights } from './CastlingRights';

export interface Position {
  readonly board: IChessBoard;
  readonly sideToMove: Color;
  readonly castlingRights: CastlingRights;
  readonly enPassant: SquareIndex | null;
  readonly halfmoveClock: number;
  readonly fullmoveNumber: number;

  /**
   * Applies a move to the current position, returning a brand new Position instance.
   * This guarantees that Position is immutable.
   */
  apply(move: Move): Position;
}
