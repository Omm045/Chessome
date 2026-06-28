import { describe, it, expect } from 'vitest';
import { Position } from '../position';

describe('Corpus Certification', () => {
  it('should parse real-world valid FEN strings', () => {
    const validFens = [
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1', // 1. e4
      'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2', // 1. e4 c5
      'r2q1rk1/pp2ppbp/2np1np1/8/3NP1b1/2N1B3/PPPQ1PPP/2KR1B1R w - - 4 10', // Dragon
      '8/8/8/8/8/k7/P7/K7 w - - 0 1' // King and Pawn endgame
    ];

    for (const fen of validFens) {
      expect(() => Position.fromFen(fen)).not.toThrow();
    }
  });
});
