export type EngineResponse =
  | { type: 'ID'; idType: 'name' | 'author'; value: string }
  | { type: 'UCIOK' }
  | { type: 'READYOK' }
  | { type: 'BESTMOVE'; bestMove: string; ponder?: string }
  | { type: 'OPTION'; name: string; optionType: 'check' | 'spin' | 'combo' | 'button' | 'string'; default?: string | number | boolean; min?: number; max?: number; vars?: string[] }
  | { type: 'INFO'; metrics: InfoMetrics }
  | { type: 'UNKNOWN'; raw: string };

export interface InfoMetrics {
  depth?: number;
  seldepth?: number;
  time?: number;
  nodes?: number;
  pv?: string[];
  multipv?: number;
  score?: ScoreMetric;
  nps?: number;
  hashfull?: number;
  tbhits?: number;
  string?: string;
}

export type ScoreMetric =
  | { type: 'cp'; value: number }
  | { type: 'mate'; value: number };
