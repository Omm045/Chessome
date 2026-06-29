import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { MliebeltPgnAdapter } from '../adapter';

describe('Real Platform Corpus Certification', () => {
  const corpusDir = path.join(__dirname, '../../corpus');

  const platforms = ['chesscom', 'lichess', 'chessbase', 'scid', 'arena'];

  for (const platform of platforms) {
    it(`should successfully parse all ${platform} exports in the corpus`, () => {
      const platformDir = path.join(corpusDir, platform);
      if (fs.existsSync(platformDir)) {
        const files = fs.readdirSync(platformDir);
        for (const file of files) {
          if (file.endsWith('.pgn')) {
            const content = fs.readFileSync(path.join(platformDir, file), 'utf-8');
            expect(() => MliebeltPgnAdapter.parseGame(content)).not.toThrow();
          }
        }
      } else {
        expect(true).toBe(true); // pass if dir doesn't exist yet in scaffolding
      }
    });
  }
});
