import { describe, it, expect } from 'vitest';
import { Position } from '../position';
import { PositionHasher } from '../hash';

describe('Roundtrip Certification', () => {
  it('should canonicalize the same position accurately', () => {
    // Normalizing castling string qKkQ -> KQkq
    const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w qKkQ - 0 1';
    const pos = Position.fromFen(fen);
    
    const canonical = PositionHasher.canonicalize(pos.ast);
    expect(canonical).toBe('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  });
});
