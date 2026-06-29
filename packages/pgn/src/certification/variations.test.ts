/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, it, expect } from 'vitest';
import { MliebeltPgnAdapter } from '../adapter';

describe('Variations Certification', () => {
  it('should parse deeply nested variations', () => {
    const pgn = `1. e4 (1. d4 (1. c4 (1. Nf3))) 1... e5`;
    const game = MliebeltPgnAdapter.parseGame(pgn);
    
    const firstMove: any = game.moves[0];
    expect(firstMove.san).toBe('e4');
    
    // Level 1
    expect(firstMove.variations).toHaveLength(1);
    const var1: any = firstMove.variations[0];
    expect(var1.nodes[0].san).toBe('d4');
    
    // Level 2
    expect(var1.nodes[0].variations).toHaveLength(1);
    const var2 = var1.nodes[0].variations[0];
    expect(var2.nodes[0].san).toBe('c4');
    
    // Level 3
    expect(var2.nodes[0].variations).toHaveLength(1);
    const var3 = var2.nodes[0].variations[0];
    expect(var3.nodes[0].san).toBe('Nf3');
  });

  it('should parse sibling variations', () => {
    const pgn = `1. e4 (1. d4) (1. c4) (1. Nf3)`;
    const game = MliebeltPgnAdapter.parseGame(pgn);
    
    const firstMove: any = game.moves[0];
    expect(firstMove.variations).toHaveLength(3);
    expect(firstMove.variations[0].nodes[0].san).toBe('d4');
    expect(firstFirstVariationNodeSan(firstMove.variations[1])).toBe('c4');
    expect(firstFirstVariationNodeSan(firstMove.variations[2])).toBe('Nf3');
  });

  function firstFirstVariationNodeSan(variation: any) {
    return variation.nodes[0].san;
  }
});
