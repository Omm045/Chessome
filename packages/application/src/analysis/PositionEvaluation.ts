import { Position, Move } from '@chessome/chess';

export interface PositionEvaluation {
  readonly position: Position;
  readonly move: Move | null; // The move that led to this position
  readonly evaluation: {
    readonly type: 'cp' | 'mate';
    readonly value: number;
  };
  readonly depth: number;
  readonly pv: readonly Move[]; // Principal Variation
  readonly nodes: number;
  readonly nps: number;
  readonly timeMs: number;
  readonly hash: number;
  readonly tbHits: number;
  readonly engineId: string;
}
