export interface EngineEvaluation {
  fen: string;
  depth: number;
  score: EvaluationScore;
  pv: string[];
  nodes: number;
  nps: number;
  time: number;
}

export interface EvaluationScore {
  type: 'cp' | 'mate';
  value: number;
}

export interface EngineInfo {
  name: string;
  author: string;
  version: string;
  options: EngineOption[];
}

export interface EngineOption {
  name: string;
  type: 'spin' | 'check' | 'combo' | 'button' | 'string';
  default?: string | number | boolean;
  min?: number;
  max?: number;
  vars?: string[];
}
