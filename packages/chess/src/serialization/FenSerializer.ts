import { Position } from '../position';
import { Color, PieceType } from '../piece';
import { fileOf, rankOf } from '../square';

export class FenSerializer {
  static serialize(position: Position): string {
    const pieces: string[] = [];
    
    // Ranks are from 8 (index 7) down to 1 (index 0)
    for (let rank = 7; rank >= 0; rank--) {
      let emptyCount = 0;
      let rankStr = '';
      
      for (let file = 0; file < 8; file++) {
        const square = rank * 8 + file;
        const piece = position.board.getPieceAt(square);
        
        if (piece) {
          if (emptyCount > 0) {
            rankStr += emptyCount;
            emptyCount = 0;
          }
          
          let char = '';
          switch (piece.type) {
            case PieceType.Pawn: char = 'p'; break;
            case PieceType.Knight: char = 'n'; break;
            case PieceType.Bishop: char = 'b'; break;
            case PieceType.Rook: char = 'r'; break;
            case PieceType.Queen: char = 'q'; break;
            case PieceType.King: char = 'k'; break;
          }
          
          if (piece.color === 'White') {
            char = char.toUpperCase();
          }
          rankStr += char;
        } else {
          emptyCount++;
        }
      }
      
      if (emptyCount > 0) {
        rankStr += emptyCount;
      }
      
      pieces.push(rankStr);
    }
    
    const piecePlacement = pieces.join('/');
    const activeColor = position.sideToMove === 'White' ? 'w' : 'b';
    
    let castling = '';
    if (position.castlingRights.whiteKingside) castling += 'K';
    if (position.castlingRights.whiteQueenside) castling += 'Q';
    if (position.castlingRights.blackKingside) castling += 'k';
    if (position.castlingRights.blackQueenside) castling += 'q';
    if (castling === '') castling = '-';
    
    let enPassant = '-';
    if (position.enPassant !== null) {
      const fileChar = String.fromCharCode(97 + fileOf(position.enPassant));
      const rankChar = String.fromCharCode(49 + rankOf(position.enPassant));
      enPassant = `${fileChar}${rankChar}`;
    }
    
    const halfmove = position.halfmoveClock.toString();
    const fullmove = position.fullmoveNumber.toString();
    
    return `${piecePlacement} ${activeColor} ${castling} ${enPassant} ${halfmove} ${fullmove}`;
  }
}
