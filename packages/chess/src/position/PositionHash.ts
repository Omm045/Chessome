import { Position } from './Position';

export interface PositionHash {
  /**
   * Computes a Zobrist hash or similar robust 64-bit hash for the given position.
   */
  hash(position: Position): bigint;
}
