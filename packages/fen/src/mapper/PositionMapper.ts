import { PositionAst } from '../ast';
import { Position, PositionBuilder, PieceType as DomainPieceType, makeSquare, File, Rank, DefaultCastlingRights } from '@chessome/chess';

export class PositionMapper {
  static map(ast: PositionAst): Position {
    const builder = new PositionBuilder();
    
    // Map Side to Move
    builder.setSideToMove(ast.activeColor === 'w' ? 'White' : 'Black');

    // Map Halfmove and Fullmove
    builder.setHalfmoveClock(ast.halfmoveClock);
    builder.setFullmoveNumber(ast.fullmoveNumber);

    // Map Castling Rights
    builder.setCastlingRights(new DefaultCastlingRights(
      ast.castlingRights.whiteKingSide,
      ast.castlingRights.whiteQueenSide,
      ast.castlingRights.blackKingSide,
      ast.castlingRights.blackQueenSide
    ));

    // Map En Passant Target
    if (ast.enPassantTarget) {
      const fileIndex = ast.enPassantTarget.charCodeAt(0) - 97; // 'a' = 97
      const rankIndex = parseInt(ast.enPassantTarget[1], 10) - 1; // '1' = 0
      builder.setEnPassant(makeSquare(fileIndex as File, rankIndex as Rank));
    }

    // Map Board
    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const pieceAst = ast.piecePlacement[r][f];
        if (pieceAst) {
          const typeMap: Record<string, DomainPieceType> = {
            'p': DomainPieceType.Pawn,
            'n': DomainPieceType.Knight,
            'b': DomainPieceType.Bishop,
            'r': DomainPieceType.Rook,
            'q': DomainPieceType.Queen,
            'k': DomainPieceType.King
          };
          
          builder.setPieceAt(makeSquare(f as File, (7 - r) as Rank), {
            type: typeMap[pieceAst.type],
            color: pieceAst.color === 'w' ? 'White' : 'Black'
          });
        }
      }
    }

    return builder.build();
  }
}
