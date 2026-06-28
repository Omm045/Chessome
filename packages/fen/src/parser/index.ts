import { Piece, Color, CastlingRights, Square } from '../ast';
import { FenDiagnostic } from '../diagnostic';

export class FieldParsers {
  
  static parsePiecePlacement(field: string): { placement: (Piece | null)[][], errors: FenDiagnostic[] } {
    const errors: FenDiagnostic[] = [];
    const placement: (Piece | null)[][] = [];
    
    const ranks = field.split('/');
    if (ranks.length !== 8) {
      errors.push({ field: 'PiecePlacement', severity: 'error', message: `Expected 8 ranks, got ${ranks.length}` });
      // Return dummy placement to allow cascading errors instead of crashing
      return { placement: Array(8).fill(Array(8).fill(null)), errors };
    }

    for (let i = 0; i < 8; i++) {
      const rankStr = ranks[i];
      const rank: (Piece | null)[] = [];
      
      for (const char of rankStr) {
        if (/[1-8]/.test(char)) {
          const emptyCount = parseInt(char, 10);
          for (let e = 0; e < emptyCount; e++) {
            rank.push(null);
          }
        } else if (/[pnbrqkPNBRQK]/.test(char)) {
          const color: Color = char === char.toLowerCase() ? 'b' : 'w';
          rank.push({ color, type: char.toLowerCase() as any });
        } else {
          errors.push({ field: 'PiecePlacement', severity: 'error', message: `Invalid character '${char}' in piece placement` });
        }
      }

      if (rank.length !== 8) {
        errors.push({ field: 'PiecePlacement', severity: 'error', message: `Rank ${8-i} does not contain exactly 8 squares (found ${rank.length})` });
      }

      placement.push(rank);
    }

    return { placement, errors };
  }

  static parseActiveColor(field: string): { color: Color, errors: FenDiagnostic[] } {
    const errors: FenDiagnostic[] = [];
    if (field !== 'w' && field !== 'b') {
      errors.push({ field: 'ActiveColor', severity: 'error', message: `Active color must be 'w' or 'b', got '${field}'` });
      return { color: 'w', errors };
    }
    return { color: field, errors };
  }

  static parseCastlingRights(field: string): { rights: CastlingRights, errors: FenDiagnostic[] } {
    const errors: FenDiagnostic[] = [];
    const rights = { whiteKingSide: false, whiteQueenSide: false, blackKingSide: false, blackQueenSide: false };
    
    if (field === '-') return { rights, errors };

    for (const char of field) {
      if (char === 'K') rights.whiteKingSide = true;
      else if (char === 'Q') rights.whiteQueenSide = true;
      else if (char === 'k') rights.blackKingSide = true;
      else if (char === 'q') rights.blackQueenSide = true;
      else {
        errors.push({ field: 'CastlingRights', severity: 'error', message: `Invalid castling right '${char}'` });
      }
    }

    return { rights, errors };
  }

  static parseEnPassant(field: string): { ep: Square | null, errors: FenDiagnostic[] } {
    const errors: FenDiagnostic[] = [];
    if (field === '-') return { ep: null, errors };
    
    if (!/^[a-h][36]$/.test(field)) {
      errors.push({ field: 'EnPassant', severity: 'error', message: `Invalid en passant target '${field}'` });
      return { ep: null, errors };
    }

    return { ep: field, errors };
  }

  static parseHalfmoveClock(field: string): { clock: number, errors: FenDiagnostic[] } {
    const errors: FenDiagnostic[] = [];
    if (!/^\d+$/.test(field)) {
      errors.push({ field: 'HalfmoveClock', severity: 'error', message: `Halfmove clock must be a non-negative integer, got '${field}'` });
      return { clock: 0, errors };
    }
    
    const clock = parseInt(field, 10);
    return { clock, errors };
  }

  static parseFullmoveNumber(field: string): { num: number, errors: FenDiagnostic[] } {
    const errors: FenDiagnostic[] = [];
    if (!/^\d+$/.test(field)) {
      errors.push({ field: 'FullmoveNumber', severity: 'error', message: `Fullmove number must be an integer >= 1, got '${field}'` });
      return { num: 1, errors };
    }
    
    const num = parseInt(field, 10);
    if (num < 1) {
      errors.push({ field: 'FullmoveNumber', severity: 'error', message: `Fullmove number must be >= 1, got '${num}'` });
      return { num: 1, errors };
    }
    return { num, errors };
  }
}
