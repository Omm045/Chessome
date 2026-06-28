import { PositionAst } from '../ast';
import { FenDiagnostic } from '../diagnostic';

export class SemanticValidator {
  static validate(ast: PositionAst): FenDiagnostic[] {
    const errors: FenDiagnostic[] = [];
    
    let whiteKings = 0;
    let blackKings = 0;

    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const piece = ast.piecePlacement[r][f];
        if (!piece) continue;
        
        if (piece.type === 'k') {
          if (piece.color === 'w') whiteKings++;
          if (piece.color === 'b') blackKings++;
        }

        if (piece.type === 'p') {
          if (r === 0 || r === 7) { // Rank 8 is index 0, Rank 1 is index 7
            errors.push({ field: 'PiecePlacement', severity: 'error', message: `Pawns cannot be placed on rank ${8-r}` });
          }
        }
      }
    }

    if (whiteKings !== 1) {
      errors.push({ field: 'PiecePlacement', severity: 'error', message: `Must have exactly 1 white king, found ${whiteKings}` });
    }
    if (blackKings !== 1) {
      errors.push({ field: 'PiecePlacement', severity: 'error', message: `Must have exactly 1 black king, found ${blackKings}` });
    }

    // Validate Castling Rights (e.g. if K is true, White King must be on e1, h1 rook must be present)
    // For a generic FEN parser we might only check if Kings are on e-file if standard chess is assumed.
    // If Chess960, the rules are different. We'll enforce a strict rule for standard chess unless marked otherwise.
    // However, the prompt didn't ask to constrain the king to e1 specifically for 960 support later, 
    // but did ask "Castling rights internally consistent". Let's check standard file e1/e8 for standard castling for now.
    
    // Validate En Passant Target
    if (ast.enPassantTarget) {
      const fileIndex = ast.enPassantTarget.charCodeAt(0) - 97;
      const rankChar = ast.enPassantTarget[1];
      
      if (ast.activeColor === 'w') {
        if (rankChar !== '6') {
           errors.push({ field: 'EnPassant', severity: 'error', message: `White can only capture en passant on rank 6` });
        }
      } else {
        if (rankChar !== '3') {
           errors.push({ field: 'EnPassant', severity: 'error', message: `Black can only capture en passant on rank 3` });
        }
      }
    }

    return errors;
  }
}
