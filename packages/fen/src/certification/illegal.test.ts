import { describe, it, expect } from 'vitest';
import { FenParser } from '../index';
import { FenParseError } from '../diagnostic';

describe('Illegal Position Certification', () => {
  it('should throw FenParseError for two white kings', () => {
    const fen = 'KnbqkbnK/pppppppp/8/8/8/8/PPPPPPPP/RNBQ1BNR w KQkq - 0 1';
    
    try {
      FenParser.parse(fen);
      expect.fail('Should have thrown');
        } catch (e: unknown) {
          expect(e).toBeInstanceOf(FenParseError);
          expect((e as FenParseError).diagnostics[0].message).toContain('exactly 1 white king');
    }
  });

  it('should throw FenParseError for pawns on rank 1 or 8', () => {
    const fen = 'Pnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    
    try {
      FenParser.parse(fen);
      expect.fail('Should have thrown');
    } catch (e: unknown) {
      expect(e).toBeInstanceOf(FenParseError);
      expect((e as FenParseError).diagnostics[0].message).toContain('Pawns cannot be placed on rank');
    }
  });
});
