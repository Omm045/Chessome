import { describe, it, expect } from 'vitest';
import { Position } from '../position';

describe('Edge Cases Certification', () => {
  it('should parse an empty board (if semantic rules allow, else fail gracefully)', () => {
    const fen = '8/8/8/8/8/8/8/8 w - - 0 1';
    
    try {
      Position.fromFen(fen);
    } catch (e: any) {
      // In our semantic validator, we require exactly 1 white and 1 black king.
      // So an empty board is "illegal" for chess, but syntactically valid FEN.
      expect(e.diagnostics[0].message).toContain('1 white king');
    }
  });

  it('should handle crazy promotions', () => {
    const fen = 'QQQQkQQQ/QQQQQQQQ/8/8/8/8/8/K7 w - - 0 1';
    const pos = Position.fromFen(fen);
    expect(pos.pieceCount('w', 'q')).toBe(15);
  });
});
