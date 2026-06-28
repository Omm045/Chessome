export enum EventNames {
  GAME_IMPORTED = 'game.imported',
  ANALYSIS_COMPLETED = 'analysis.completed',
  ENGINE_ERROR = 'engine.error'
}

export interface IEventPayload {
  readonly eventId: string;
  readonly timestamp: number;
  readonly version: number;
}

export interface GameImportedEvent extends IEventPayload {
  readonly gameId: string;
  readonly pgnText?: string;
  readonly metadata?: Record<string, unknown>;
}

export interface AnalysisCompletedEvent extends IEventPayload {
  readonly analysisId: string;
  readonly gameId: string;
  readonly engine: string;
  readonly evaluation: number; // e.g., centipawns
}

export interface EngineErrorEvent extends IEventPayload {
  readonly analysisId: string;
  readonly engine: string;
  readonly errorMessage: string;
}

export class EventSerializer {
  static serialize<T extends IEventPayload>(payload: T): string {
    return JSON.stringify(payload);
  }

  static deserialize<T extends IEventPayload>(data: string): T {
    return JSON.parse(data) as T;
  }
}
