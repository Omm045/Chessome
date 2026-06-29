import { Color } from '../piece';

export interface CastlingRights {
  readonly whiteKingside: boolean;
  readonly whiteQueenside: boolean;
  readonly blackKingside: boolean;
  readonly blackQueenside: boolean;
  
  hasAnyRights(): boolean;
  canCastle(color: Color, side: 'Kingside' | 'Queenside'): boolean;
}

export class DefaultCastlingRights implements CastlingRights {
  constructor(
    public readonly whiteKingside: boolean,
    public readonly whiteQueenside: boolean,
    public readonly blackKingside: boolean,
    public readonly blackQueenside: boolean
  ) {}

  hasAnyRights(): boolean {
    return this.whiteKingside || this.whiteQueenside || this.blackKingside || this.blackQueenside;
  }

  canCastle(color: Color, side: 'Kingside' | 'Queenside'): boolean {
    if (color === 'White') {
      return side === 'Kingside' ? this.whiteKingside : this.whiteQueenside;
    } else {
      return side === 'Kingside' ? this.blackKingside : this.blackQueenside;
    }
  }
}
