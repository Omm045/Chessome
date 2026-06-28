import { PositionAst } from '../ast';

export class PositionHasher {
  /**
   * Generates a canonical FEN string from a PositionAst.
   * This guarantees that equivalent positions always hash to the exact same string,
   * regardless of the original FEN string's formatting or en passant edge cases.
   */
  static canonicalize(ast: PositionAst): string {
    const placement = ast.piecePlacement.map(rank => {
      let rankStr = '';
      let emptyCount = 0;
      for (const piece of rank) {
        if (piece === null) {
          emptyCount++;
        } else {
          if (emptyCount > 0) {
            rankStr += emptyCount;
            emptyCount = 0;
          }
          rankStr += piece.color === 'w' ? piece.type.toUpperCase() : piece.type;
        }
      }
      if (emptyCount > 0) {
        rankStr += emptyCount;
      }
      return rankStr;
    }).join('/');

    let castling = '';
    if (ast.castlingRights.whiteKingSide) castling += 'K';
    if (ast.castlingRights.whiteQueenSide) castling += 'Q';
    if (ast.castlingRights.blackKingSide) castling += 'k';
    if (ast.castlingRights.blackQueenSide) castling += 'q';
    if (castling === '') castling = '-';

    const ep = ast.enPassantTarget || '-';

    return `${placement} ${ast.activeColor} ${castling} ${ep} ${ast.halfmoveClock} ${ast.fullmoveNumber}`;
  }
}
