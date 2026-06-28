import { FenParseError } from '../diagnostic';

export class FenTokenizer {
  static tokenize(fen: string): string[] {
    const trimmed = fen.trim();
    if (!trimmed) {
      throw new FenParseError('FEN string is empty', [{
        field: 'Global',
        severity: 'error',
        message: 'FEN string cannot be empty'
      }]);
    }

    // Split by one or more whitespace characters
    const tokens = trimmed.split(/\s+/);

    if (tokens.length !== 6) {
      throw new FenParseError(`Expected exactly 6 fields in FEN, found ${tokens.length}`, [{
        field: 'Global',
        severity: 'error',
        message: `FEN string must contain 6 space-separated fields, got ${tokens.length}`
      }]);
    }

    return tokens;
  }
}
