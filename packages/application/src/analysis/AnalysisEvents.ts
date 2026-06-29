import { PositionEvaluation } from './PositionEvaluation';
import { AnalysisReport } from './AnalysisReport';

export type AnalysisStartedEvent = { type: 'AnalysisStarted'; sessionId: string; gameId?: string };
export type PositionStartedEvent = { type: 'PositionStarted'; sessionId: string; ply: number };
export type PositionCompletedEvent = { type: 'PositionCompleted'; sessionId: string; ply: number; evaluation: PositionEvaluation };
export type EngineRestartedEvent = { type: 'EngineRestarted'; sessionId: string; reason: string };
export type ProgressUpdatedEvent = { 
  type: 'ProgressUpdated'; 
  sessionId: string; 
  ply: number;
  totalPly: number;
  depth: number;
  engineState: 'warm' | 'busy' | 'restarting';
  elapsedMs: number;
  estimatedRemainingMs?: number;
};
export type AnalysisCompletedEvent = { type: 'AnalysisCompleted'; sessionId: string; report: AnalysisReport };
export type AnalysisCancelledEvent = { type: 'AnalysisCancelled'; sessionId: string; reason?: string };
export type AnalysisFailedEvent = { type: 'AnalysisFailed'; sessionId: string; error: Error };

export type AnalysisEvent = 
  | AnalysisStartedEvent
  | PositionStartedEvent
  | PositionCompletedEvent
  | EngineRestartedEvent
  | ProgressUpdatedEvent
  | AnalysisCompletedEvent
  | AnalysisCancelledEvent
  | AnalysisFailedEvent;
