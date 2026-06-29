import { describe, it, expect } from 'vitest';
import { FenParser } from '../index';
import { FenSerializer } from '@chessome/chess';

describe('Round-trip Certification', () => {
  it('should maintain stability after parsing and serializing', () => {
    const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    const pos = FenParser.parse(fen);
    
    const serialized = FenSerializer.serialize(pos);
    expect(serialized).toBe(fen);
  });
});
