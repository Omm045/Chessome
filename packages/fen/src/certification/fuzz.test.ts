import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { FenParser } from '../index';

describe('Fuzz Certification', () => {
  it('should not crash V8 on random ASCII strings', () => {
    fc.assert(
      fc.property(fc.asciiString(), (garbageStr) => {
        try {
          FenParser.parse(garbageStr);
        } catch (e: unknown) {
          expect((e as Error).name).toBe('FenParseError');
        }
      }),
      { numRuns: 100 }
    );
  });
});
