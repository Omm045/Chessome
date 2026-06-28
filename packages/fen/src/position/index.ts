import { PositionAst, PieceType, Color } from '../ast';
import { FenTokenizer } from '../tokenizer';
import { FieldParsers } from '../parser';
import { SemanticValidator } from '../validator';
import { FenDiagnostic, FenParseError } from '../diagnostic';

export class Position {
  constructor(public readonly ast: PositionAst) {}

  static fromFen(fen: string): Position {
    const tokens = FenTokenizer.tokenize(fen);
    
    const errors: FenDiagnostic[] = [];
    
    const placementResult = FieldParsers.parsePiecePlacement(tokens[0]);
    errors.push(...placementResult.errors);
    
    const colorResult = FieldParsers.parseActiveColor(tokens[1]);
    errors.push(...colorResult.errors);
    
    const castlingResult = FieldParsers.parseCastlingRights(tokens[2]);
    errors.push(...castlingResult.errors);
    
    const epResult = FieldParsers.parseEnPassant(tokens[3]);
    errors.push(...epResult.errors);
    
    const halfmoveResult = FieldParsers.parseHalfmoveClock(tokens[4]);
    errors.push(...halfmoveResult.errors);
    
    const fullmoveResult = FieldParsers.parseFullmoveNumber(tokens[5]);
    errors.push(...fullmoveResult.errors);

    const ast: PositionAst = {
      piecePlacement: placementResult.placement,
      activeColor: colorResult.color,
      castlingRights: castlingResult.rights,
      enPassantTarget: epResult.ep,
      halfmoveClock: halfmoveResult.clock,
      fullmoveNumber: fullmoveResult.num
    };

    if (errors.length > 0) {
      throw new FenParseError('Syntax errors found in FEN', errors);
    }

    const semanticErrors = SemanticValidator.validate(ast);
    if (semanticErrors.length > 0) {
      throw new FenParseError('Semantic errors found in FEN', semanticErrors);
    }

    return new Position(ast);
  }

  // Position Inspector Methods
  pieceCount(color: Color, type?: PieceType): number {
    let count = 0;
    for (const rank of this.ast.piecePlacement) {
      for (const piece of rank) {
        if (piece && piece.color === color) {
          if (!type || piece.type === type) count++;
        }
      }
    }
    return count;
  }

  materialBalance(): number {
    const values = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
    let balance = 0;
    for (const rank of this.ast.piecePlacement) {
      for (const piece of rank) {
        if (piece) {
          const val = values[piece.type];
          balance += piece.color === 'w' ? val : -val;
        }
      }
    }
    return balance;
  }
}
