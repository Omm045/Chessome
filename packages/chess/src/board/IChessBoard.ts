import { SquareIndex } from '../square';
import { Piece, Color } from '../piece';

export interface IChessBoard {
  /**
   * Retrieves the piece at the specified square, or null if empty.
   */
  getPieceAt(square: SquareIndex): Piece | null;

  /**
   * Returns the square index of the specified color's king.
   * Will throw or return a specific invalid constant if the king is absent.
   */
  getKingSquare(color: Color): SquareIndex;

  /**
   * Retrieves all squares occupied by the specified color.
   * If no color is provided, retrieves all occupied squares.
   */
  getOccupancy(color?: Color): readonly SquareIndex[];

  /**
   * Applies a move or placement mutation. 
   * Note: The board itself is mutable internally, but Position will treat it as a building block and clone it for immutability.
   */
  setPieceAt(square: SquareIndex, piece: Piece | null): void;
  
  /**
   * Creates a deep clone of the board state.
   */
  clone(): IChessBoard;
}
