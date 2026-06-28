export interface CloudAnalysisJob {
  jobId: string;
  gameId: string;
  fen: string;
  depth: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  progress?: number;
  result?: MoveReview[];
}

export interface MoveReview {
  fen: string;
  move: string;
  classification: MoveClassification;
  evalBefore: number;
  evalAfter: number;
  accuracy: number;
  bestMove: string;
}

export enum MoveClassification {
  BRILLIANT = 'BRILLIANT',
  GREAT = 'GREAT',
  BEST = 'BEST',
  EXCELLENT = 'EXCELLENT',
  GOOD = 'GOOD',
  BOOK = 'BOOK',
  INACCURACY = 'INACCURACY',
  MISTAKE = 'MISTAKE',
  BLUNDER = 'BLUNDER',
  MISSED_WIN = 'MISSED_WIN',
}

export interface GameReview {
  gameId: string;
  overallAccuracyWhite: number;
  overallAccuracyBlack: number;
  moves: MoveReview[];
}
