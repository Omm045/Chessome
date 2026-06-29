import { IChessBoard } from './IChessBoard';
import { SquareIndex, isValidSquare } from '../square';
import { Piece, Color, PieceType } from '../piece';

export class MailboxBoard implements IChessBoard {
  private readonly squares: Array<Piece | null>;

  constructor() {
    this.squares = new Array(64).fill(null);
  }

  getPieceAt(square: SquareIndex): Piece | null {
    if (!isValidSquare(square)) return null;
    return this.squares[square];
  }

  getKingSquare(color: Color): SquareIndex {
    for (let i = 0; i < 64; i++) {
      const piece = this.squares[i];
      if (piece && piece.type === PieceType.King && piece.color === color) {
        return i;
      }
    }
    throw new Error(`King of color ${color} not found on the board`);
  }

  getOccupancy(color?: Color): readonly SquareIndex[] {
    const occupied: SquareIndex[] = [];
    for (let i = 0; i < 64; i++) {
      const piece = this.squares[i];
      if (piece && (!color || piece.color === color)) {
        occupied.push(i);
      }
    }
    return occupied;
  }

  setPieceAt(square: SquareIndex, piece: Piece | null): void {
    if (isValidSquare(square)) {
      this.squares[square] = piece;
    }
  }

  clone(): IChessBoard {
    const cloned = new MailboxBoard();
    for (let i = 0; i < 64; i++) {
      cloned.squares[i] = this.squares[i];
    }
    return cloned;
  }
}
