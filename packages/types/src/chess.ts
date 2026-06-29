export type FEN = string;
export type PGN = string;
export type SAN = string;
export type UCI = string;

export enum PieceColor {
  WHITE = 'w',
  BLACK = 'b',
}

export enum PieceType {
  PAWN = 'p',
  KNIGHT = 'n',
  BISHOP = 'b',
  ROOK = 'r',
  QUEEN = 'q',
  KING = 'k',
}

export interface ChessMove {
  from: string;
  to: string;
  promotion?: PieceType;
  san: SAN;
  uci: UCI;
}

export interface GameMetadata {
  white: string;
  black: string;
  date: string;
  result: string;
  eco?: string;
  event?: string;
}
