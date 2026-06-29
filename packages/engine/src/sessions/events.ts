import { IEventPayload } from '@chessome/events';

export interface EngineSessionStartedEvent extends IEventPayload {
  sessionId: string;
}
export interface EngineSessionReadyEvent extends IEventPayload {
  sessionId: string;
}
export interface EngineSessionDepthEvent extends IEventPayload {
  sessionId: string;
  depth: number;
  seldepth: number;
}
export interface EngineSessionPVEvent extends IEventPayload {
  sessionId: string;
  depth: number;
  scoreCp?: number;
  scoreMate?: number;
  pv: string[];
  multipv: number;
}
export interface EngineSessionBestMoveEvent extends IEventPayload {
  sessionId: string;
  bestMove: string;
  ponder?: string;
}
export interface EngineSessionCompletedEvent extends IEventPayload {
  sessionId: string;
}
export interface EngineSessionCancelledEvent extends IEventPayload {
  sessionId: string;
}
export interface EngineSessionFailedEvent extends IEventPayload {
  sessionId: string;
  error: string;
}
export interface EngineSessionDisposedEvent extends IEventPayload {
  sessionId: string;
}

export interface IEngineSessionEvents {
  on(event: 'Started', listener: (e: EngineSessionStartedEvent) => void): void;
  on(event: 'Ready', listener: (e: EngineSessionReadyEvent) => void): void;
  on(event: 'Depth', listener: (e: EngineSessionDepthEvent) => void): void;
  on(event: 'PV', listener: (e: EngineSessionPVEvent) => void): void;
  on(event: 'BestMove', listener: (e: EngineSessionBestMoveEvent) => void): void;
  on(event: 'Completed', listener: (e: EngineSessionCompletedEvent) => void): void;
  on(event: 'Cancelled', listener: (e: EngineSessionCancelledEvent) => void): void;
  on(event: 'Failed', listener: (e: EngineSessionFailedEvent) => void): void;
  on(event: 'Disposed', listener: (e: EngineSessionDisposedEvent) => void): void;
}
