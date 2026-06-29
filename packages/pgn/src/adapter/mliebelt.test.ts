/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, it, expect } from 'vitest';
import { MliebeltPgnAdapter } from './mliebelt';

describe('MliebeltPgnAdapter', () => {
  it('should parse a basic game with tags and moves', () => {
    const pgn = `
[Event "FIDE World Cup 2017"]
[Result "1/2-1/2"]

1. e4 e5 2. Nf3 Nc6 1/2-1/2
    `;
    const game = MliebeltPgnAdapter.parseGame(pgn);

    expect(game.type).toBe('Game');
    expect(game.tags.find(t => t.key === 'Event')?.value).toBe('FIDE World Cup 2017');
    expect(game.result?.result).toBe('1/2-1/2');

    // Mliebelt groups moves into tokens. e4, e5, Nf3, Nc6.
    const moves = game.moves.filter(m => m.type === 'Move') as any[];
    expect(moves).toHaveLength(4);
    expect(moves[0].san).toBe('e4');
    expect(moves[3].san).toBe('Nc6');
  });

  it('should parse variations and comments', () => {
    const pgn = `1. e4 {Best by test} (1. d4 {Queen's pawn}) 1... e5`;
    const game = MliebeltPgnAdapter.parseGame(pgn);

    const moves = game.moves.filter(m => m.type === 'Move') as any[];
    expect(moves).toHaveLength(2);

    expect(moves[0].san).toBe('e4');
    expect(moves[0].comments[0].text).toContain('Best by test');
    
    expect(moves[0].variations).toHaveLength(1);
    expect(moves[0].variations[0].nodes[0].san).toBe('d4');
    expect(moves[0].variations[0].nodes[0].comments[0].text).toContain("Queen's pawn");
  });

  it('should throw PgnParseError for malformed PGN', () => {
    const pgn = `[Event "Missing Quote] 1. e4`;
    expect(() => MliebeltPgnAdapter.parseGame(pgn)).toThrow('Expected');
  });
});
