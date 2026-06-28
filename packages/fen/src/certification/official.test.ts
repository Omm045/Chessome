import { describe, it, expect } from 'vitest';
import { Position } from '../position';

describe('Official FEN Certification', () => {
  it('should parse the starting position', () => {
    const startFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    const pos = Position.fromFen(startFen);
    
    expect(pos.ast.activeColor).toBe('w');
    expect(pos.ast.castlingRights.whiteKingSide).toBe(true);
    expect(pos.ast.castlingRights.blackQueenSide).toBe(true);
    expect(pos.ast.enPassantTarget).toBeNull();
    expect(pos.ast.halfmoveClock).toBe(0);
    expect(pos.ast.fullmoveNumber).toBe(1);
    
    expect(pos.pieceCount('w', 'k')).toBe(1);
    expect(pos.pieceCount('b', 'p')).toBe(8);
    expect(pos.materialBalance()).toBe(0);
  });
});
