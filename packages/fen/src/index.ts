import { FenTokenizer } from './tokenizer';
import { FieldParsers } from './parser';
import { SemanticValidator } from './semantic';
import { PositionMapper } from './mapper/PositionMapper';
import { FenParseError } from './diagnostic';
import { Position } from '@chessome/chess';

export class FenParser {
  static parse(fen: string): Position {
    // 1. Tokenize
    const tokens = FenTokenizer.tokenize(fen);
    
    // 2. Parse Fields
    const piecePlacement = FieldParsers.parsePiecePlacement(tokens[0]);
    const activeColor = FieldParsers.parseActiveColor(tokens[1]);
    const castlingRights = FieldParsers.parseCastlingRights(tokens[2]);
    const enPassant = FieldParsers.parseEnPassant(tokens[3]);
    const halfmove = FieldParsers.parseHalfmoveClock(tokens[4]);
    const fullmove = FieldParsers.parseFullmoveNumber(tokens[5]);
    
    const errors = [
      ...piecePlacement.errors,
      ...activeColor.errors,
      ...castlingRights.errors,
      ...enPassant.errors,
      ...halfmove.errors,
      ...fullmove.errors
    ];
    
    if (errors.length > 0) {
      throw new FenParseError('Syntax errors in FEN', errors);
    }
    
    const ast = {
      piecePlacement: piecePlacement.placement,
      activeColor: activeColor.color,
      castlingRights: castlingRights.rights,
      enPassantTarget: enPassant.ep,
      halfmoveClock: halfmove.clock,
      fullmoveNumber: fullmove.num
    };

    // 3. Semantic Analysis
    const semanticErrors = SemanticValidator.validate(ast);
    if (semanticErrors.length > 0) {
      throw new FenParseError('Semantic errors in FEN', semanticErrors);
    }

    // 4. Map to Domain
    return PositionMapper.map(ast);
  }
}

export * from './ast';
export * from './tokenizer';
export * from './parser';
export * from './semantic';
export * from './mapper/PositionMapper';
export * from './diagnostic';
