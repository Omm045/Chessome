import { describe, it, expect } from 'vitest';
import { FenParser } from '../index';
import { PieceType } from '@chessome/chess';

describe('Official FEN Certification', () => {
  it('should parse the starting position', () => {
    const startFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    const pos = FenParser.parse(startFen);
    
    expect(pos.sideToMove).toBe('White');
    expect(pos.castlingRights.whiteKingside).toBe(true);
    expect(pos.castlingRights.blackQueenside).toBe(true);
    expect(pos.enPassant).toBeNull();
    expect(pos.halfmoveClock).toBe(0);
    expect(pos.fullmoveNumber).toBe(1);
    
    expect(pos.board.getPieceAt(4)?.type).toBe(PieceType.King);
    expect(pos.board.getPieceAt(4)?.color).toBe('White');
  });
});
