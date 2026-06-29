import { Position } from '../position';

export interface EpdSerializer {
  serialize(position: Position, operations?: Record<string, string>): string;
}
