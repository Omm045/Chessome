export type Color = 'w' | 'b';
export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';

export interface Piece {
  color: Color;
  type: PieceType;
}

export type Square = string; // e.g., 'e4', 'a1'

export interface CastlingRights {
  whiteKingSide: boolean; // K
  whiteQueenSide: boolean; // Q
  blackKingSide: boolean; // k
  blackQueenSide: boolean; // q
}

export interface PositionAst {
  piecePlacement: (Piece | null)[][]; // 8x8 array (rank 8 to rank 1, file A to H)
  activeColor: Color;
  castlingRights: CastlingRights;
  enPassantTarget: Square | null;
  halfmoveClock: number;
  fullmoveNumber: number;
}
