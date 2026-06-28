export interface DomainEvent<T = unknown> {
  id: string;
  type: string;
  timestamp: Date;
  aggregateId: string;
  payload: T;
  version: number;
}

export enum EventNames {
  GAME_IMPORTED = 'GameImported',
  GAME_SYNCED = 'GameSynced',
  ANALYSIS_QUEUED = 'AnalysisQueued',
  ANALYSIS_STARTED = 'AnalysisStarted',
  EVALUATION_PRODUCED = 'EvaluationProduced',
  ANALYSIS_COMPLETED = 'AnalysisCompleted',
  JOB_CANCELLED = 'JobCancelled',
  WORKER_OFFLINE = 'WorkerOffline',
  WORKER_RECOVERED = 'WorkerRecovered',
}
