import { GameMetadata, PGN } from './chess';
import { EngineEvaluation } from './engine';

export interface IChessProvider {
  parsePGN(pgn: PGN): GameMetadata[];
  validateMove(fen: string, move: string): boolean;
  getLegalMoves(fen: string): string[];
}

export interface IEngineProvider {
  analyzePosition(fen: string, depth: number): Promise<EngineEvaluation>;
  stopAnalysis(): void;
  isReady(): Promise<boolean>;
}

export interface IAIProvider {
  explainMove(fen: string, bestMove: string, playedMove: string): Promise<string>;
  generateSummary(gameId: string): Promise<string>;
}
