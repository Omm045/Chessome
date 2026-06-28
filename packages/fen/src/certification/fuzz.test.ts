import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { Position } from '../position';
import { FenParseError } from '../diagnostic';

describe('Fuzz Certification', () => {
  it('should not crash V8 on random ASCII strings', () => {
    fc.assert(
      fc.property(fc.asciiString(), (garbageStr) => {
        try {
          Position.fromFen(garbageStr);
        } catch (e: any) {
          expect(e.name).toBe('FenParseError');
        }
      }),
      { numRuns: 100 }
    );
  });
});
