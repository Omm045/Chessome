/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, it, expect } from 'vitest';
import { MliebeltPgnAdapter } from '../adapter';
import { PgnParseError } from '../diagnostic';

describe('Recovery Certification', () => {
  it('should return strict structured diagnostics for malformed PGN', () => {
    const pgn = `[Event "Missing Quote] 1. e4`;
    
    try {
      MliebeltPgnAdapter.parseGame(pgn);
      expect.fail('Should throw a PgnParseError');
    } catch (e: any) {
      expect(e).toBeInstanceOf(PgnParseError);
      
      const pgnError = e as PgnParseError;
      expect(pgnError.diagnostics).toHaveLength(1);
      
      const diag = pgnError.diagnostics[0];
      expect(diag.line).toBe(1);
      expect(diag.severity).toBe('error');
    }
  });
});
