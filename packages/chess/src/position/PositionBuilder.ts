import { Position } from './Position';
import { MailboxBoard, IChessBoard } from '../board';
import { Color, flipColor, PieceType } from '../piece';
import { SquareIndex, rankOf } from '../square';
import { Move, MoveFlags } from '../move';
import { CastlingRights, DefaultCastlingRights } from './CastlingRights';

class DefaultPosition implements Position {
  constructor(
    public readonly board: IChessBoard,
    public readonly sideToMove: Color,
    public readonly castlingRights: CastlingRights,
    public readonly enPassant: SquareIndex | null,
    public readonly halfmoveClock: number,
    public readonly fullmoveNumber: number
  ) {}

  apply(move: Move): Position {
    // 1. Clone the board
    const newBoard = this.board.clone();
    
    // 2. Perform the move
    const movingPiece = newBoard.getPieceAt(move.from);
    if (!movingPiece) {
      throw new Error('Invalid move: no piece at source square');
    }
    
    newBoard.setPieceAt(move.from, null);
    
    // Check for promotion
    if ((move.flags & MoveFlags.Promotion) && move.promotion) {
      newBoard.setPieceAt(move.to, { type: move.promotion, color: this.sideToMove });
    } else {
      newBoard.setPieceAt(move.to, movingPiece);
    }
    
    // Handle En Passant capture
    if (move.flags & MoveFlags.EnPassant) {
      const capturedPawnSquare = this.sideToMove === 'White' ? move.to - 8 : move.to + 8;
      newBoard.setPieceAt(capturedPawnSquare, null);
    }

    // Handle Castling
    if (move.flags & MoveFlags.Castling) {
      // White Kingside
      if (move.to === 6) {
        const rook = newBoard.getPieceAt(7);
        newBoard.setPieceAt(7, null);
        newBoard.setPieceAt(5, rook);
      }
      // White Queenside
      else if (move.to === 2) {
        const rook = newBoard.getPieceAt(0);
        newBoard.setPieceAt(0, null);
        newBoard.setPieceAt(3, rook);
      }
      // Black Kingside
      else if (move.to === 62) {
        const rook = newBoard.getPieceAt(63);
        newBoard.setPieceAt(63, null);
        newBoard.setPieceAt(61, rook);
      }
      // Black Queenside
      else if (move.to === 58) {
        const rook = newBoard.getPieceAt(56);
        newBoard.setPieceAt(56, null);
        newBoard.setPieceAt(59, rook);
      }
    }

    // 3. Update State
    const nextSide = flipColor(this.sideToMove);
    const nextFullmove = this.sideToMove === 'Black' ? this.fullmoveNumber + 1 : this.fullmoveNumber;
    
    // Halfmove clock resets on pawn moves or captures
    let nextHalfmove = this.halfmoveClock + 1;
    if (movingPiece.type === PieceType.Pawn || (move.flags & MoveFlags.Capture)) {
      nextHalfmove = 0;
    }

    // En Passant target
    let nextEnPassant: SquareIndex | null = null;
    if (movingPiece.type === PieceType.Pawn && Math.abs(rankOf(move.to) - rankOf(move.from)) === 2) {
      nextEnPassant = this.sideToMove === 'White' ? move.from + 8 : move.from - 8;
    }

    // Castling Rights
    // For a fully correct implementation, we'd invalidate rights when King or Rooks move.
    // Stubbing this logic for now, keeping current rights unless handled specifically.
    const nextCastlingRights = new DefaultCastlingRights(
      this.castlingRights.whiteKingside,
      this.castlingRights.whiteQueenside,
      this.castlingRights.blackKingside,
      this.castlingRights.blackQueenside
    ); // (Needs full castling update logic based on move.from/to)

    return new DefaultPosition(
      newBoard,
      nextSide,
      nextCastlingRights,
      nextEnPassant,
      nextHalfmove,
      nextFullmove
    );
  }
}

export class PositionBuilder {
  private board: IChessBoard = new MailboxBoard();
  private sideToMove: Color = 'White';
  private castlingRights: CastlingRights = new DefaultCastlingRights(false, false, false, false);
  private enPassant: SquareIndex | null = null;
  private halfmoveClock = 0;
  private fullmoveNumber = 1;

  public setBoard(board: IChessBoard): this {
    this.board = board;
    return this;
  }

  public setSideToMove(color: Color): this {
    this.sideToMove = color;
    return this;
  }

  public setCastlingRights(rights: CastlingRights): this {
    this.castlingRights = rights;
    return this;
  }

  public setEnPassant(ep: SquareIndex | null): this {
    this.enPassant = ep;
    return this;
  }

  public setHalfmoveClock(clock: number): this {
    this.halfmoveClock = clock;
    return this;
  }

  public setFullmoveNumber(num: number): this {
    this.fullmoveNumber = num;
    return this;
  }

  public setPieceAt(square: SquareIndex, piece: { type: PieceType; color: Color } | null): this {
    this.board.setPieceAt(square, piece);
    return this;
  }

  public build(): Position {
    return new DefaultPosition(
      this.board,
      this.sideToMove,
      this.castlingRights,
      this.enPassant,
      this.halfmoveClock,
      this.fullmoveNumber
    );
  }
}
