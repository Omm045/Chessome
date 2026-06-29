import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { UciDecoder } from '../decoder';

describe('UCI Compliance Suite: Golden Corpus parsing', () => {
  const testDataDir = path.resolve(__dirname, '../../../test-data');
  const engineNames = ['stockfish', 'berserk', 'koivisto', 'ethereal', 'malformed', 'edge-cases'];

  for (const engine of engineNames) {
    it(`should parse every line in the ${engine} transcript without crashing`, () => {
      const dirPath = path.join(testDataDir, engine);
      if (!fs.existsSync(dirPath)) return;
      
      const files = fs.readdirSync(dirPath);
      
      for (const file of files) {
        if (!file.endsWith('.txt')) continue;
        const transcriptPath = path.join(dirPath, file);
        const transcript = fs.readFileSync(transcriptPath, 'utf-8');
        
        const lines = transcript.split('\n');
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          
          const response = UciDecoder.decode(trimmed);
          expect(response).toHaveProperty('type');
        }
      }
    });
  }
});
