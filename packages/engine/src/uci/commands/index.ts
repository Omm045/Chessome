export type EngineCommand =
  | { type: 'UCI' }
  | { type: 'IS_READY' }
  | { type: 'UCINEWGAME' }
  | { type: 'POSITION'; fen: string; moves?: string[] }
  | { type: 'SET_OPTION'; name: string; value: string | number | boolean }
  | { type: 'GO'; searchParams: GoParams }
  | { type: 'STOP' }
  | { type: 'QUIT' };

export interface GoParams {
  depth?: number;
  nodes?: number;
  movetime?: number;
  infinite?: boolean;
  wtime?: number;
  btime?: number;
  winc?: number;
  binc?: number;
  movestogo?: number;
}
