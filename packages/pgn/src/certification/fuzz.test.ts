/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { MliebeltPgnAdapter } from '../adapter';

describe('Fuzz Certification', () => {
  it('should never crash the node process (V8) even on garbage data', () => {
    // Generate random strings and ensure parser throws a standard Error or PgnParseError
    // but does NOT segfault, hang, or throw a V8 out-of-memory.
    fc.assert(
      fc.property(fc.string(), (garbageStr) => {
        try {
          MliebeltPgnAdapter.parseGame(garbageStr);
        } catch (e: any) {
          // It is expected to throw parsing errors on garbage
          expect(e.name).toBe('PgnParseError');
        }
      }),
      { numRuns: 100 }
    );
  });

  it('should gracefully handle mutated valid games without crashing', () => {
    const validGame = `[Event "Fuzz"]\n\n1. e4 e5 2. Nf3 Nc6 1-0`;
    
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: validGame.length }), 
        fc.integer({ min: 0, max: validGame.length }),
        (start, end) => {
          const s = Math.min(start, end);
          const e = Math.max(start, end);
          // truncate or mutate
          const mutated = validGame.slice(0, s) + validGame.slice(e);
          try {
            if (mutated.trim().length > 0) {
              MliebeltPgnAdapter.parseGame(mutated);
            }
          } catch (err: any) {
             expect(err.name).toBe('PgnParseError');
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
