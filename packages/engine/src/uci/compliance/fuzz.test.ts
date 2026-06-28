import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { UciDecoder } from '../decoder';

describe('UCI Compliance Suite: Fuzz Testing', () => {
  it('should survive 100,000 random mutations without throwing an exception', () => {
    // Generate massive random Unicode strings, malformed payloads, whitespaces, etc.
    const runParameters = { numRuns: 100000 };

    fc.assert(
      fc.property(fc.string(), (garbageString) => {
        // The decoder should never throw, it should return a discriminated EngineResponse
        const response = UciDecoder.decode(garbageString);

        // Assert that we always get an object back with a type property
        expect(response).toHaveProperty('type');

        // We can do further checks, e.g. if it parsed something valid, it should be well-formed
        // But the primary contract here is resilience (no unhandled exceptions).
      }),
      runParameters
    );
  });
});
