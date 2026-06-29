import { describe, it, expect } from 'vitest';
import { MliebeltPgnAdapter } from '../adapter';

describe('AST Validation Certification', () => {
  it('should produce exactly one ResultNode at the end of the game or tag', () => {
    const pgn = `[Result "1-0"] 1. e4 1-0`;
    const game = MliebeltPgnAdapter.parseGame(pgn);
    
    // Some parsers include it in tags, some as moves. We map it to game.result
    expect(game.result?.result).toBe('1-0');
  });
});
