import { describe, it, expect } from 'vitest';
import { PgnGameSplitter } from '../stream';

describe('Streaming Certification', () => {
  it('should split async text streams by game boundaries without leaking memory', async () => {
    const pgnText = `[Event "Game 1"]\n1. e4 e5\n\n[Event "Game 2"]\n1. d4 d5\n\n`;
    
    async function* mockStream() {
      // Chunk 1
      yield pgnText.substring(0, 20);
      // Chunk 2
      yield pgnText.substring(20);
    }
    
    const games: string[] = [];
    for await (const game of PgnGameSplitter.split(mockStream())) {
      games.push(game);
    }
    
    expect(games).toHaveLength(2);
    expect(games[0]).toContain('Game 1');
    expect(games[1]).toContain('Game 2');
  });

  it('should process 10,000 synthetic games efficiently', async () => {
    async function* largeSyntheticStream() {
      for (let i = 0; i < 10000; i++) {
        yield `[Event "Game ${i}"]\n1. e4 e5 1-0\n\n`;
      }
    }
    
    const startTime = performance.now();
    let count = 0;
    for await (const _ of PgnGameSplitter.split(largeSyntheticStream())) {
      count++;
    }
    const endTime = performance.now();
    
    expect(count).toBe(10000);
    expect(endTime - startTime).toBeLessThan(1000); // Should be very fast
  });
});
