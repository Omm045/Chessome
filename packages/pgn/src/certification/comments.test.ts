/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, it, expect } from 'vitest';
import { MliebeltPgnAdapter } from '../adapter';

describe('Comments Certification', () => {
  it('should parse multiline and UTF-8 comments', () => {
    const pgn = `1. e4 { 
    Multiline comment 
    Line 2 
    } 1... e5 { 🤔 Emoji! }`;
    const game = MliebeltPgnAdapter.parseGame(pgn);
    
    expect((game.moves[0] as any).comments[0].text).toContain('Multiline');
    expect((game.moves[1] as any).comments[0].text).toContain('🤔 Emoji!');
  });
});
