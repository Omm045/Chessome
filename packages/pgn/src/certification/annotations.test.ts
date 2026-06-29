/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, it, expect } from 'vitest';
import { MliebeltPgnAdapter } from '../adapter';

describe('Annotation Certification', () => {
  it('should parse clock and eval extensions from comments', () => {
    // Current adapter has a TODO for extracting the [%clk] extensions properly,
    // but we certify that it parses them as comments without failing.
    const pgn = `1. e4 {[%clk 1:00:00]} e5 {[%clk 0:59:58] [%eval -0.5]}`;
    const game = MliebeltPgnAdapter.parseGame(pgn);
    
    expect(game.moves[0].type).toBe('Move');
    expect((game.moves[0] as any).comments[0].text).toContain('[%clk 1:00:00]');
    
    expect(game.moves[1].type).toBe('Move');
    expect((game.moves[1] as any).comments[0].text).toContain('[%eval -0.5]');
  });
});
