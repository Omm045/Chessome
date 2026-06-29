import { Position } from '../position';
import { Move } from '../move';

export interface ReplayState {
  readonly ply: number;
  readonly position: Position;
  readonly lastMove: Move | null;
}
