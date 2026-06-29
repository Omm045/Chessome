import { Position } from './Position';
import { SquareIndex } from '../square';

export interface PositionInspector {
  isCheck(position: Position): boolean;
  isCheckmate(position: Position): boolean;
  isStalemate(position: Position): boolean;
  isInsufficientMaterial(position: Position): boolean;
  findAttackers(position: Position, target: SquareIndex): readonly SquareIndex[];
}
