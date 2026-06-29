import { Position } from '../position';

export interface JsonSerializer {
  serialize(position: Position): string;
}
