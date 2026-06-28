export type EngineHealthStatus = 
  | 'Ready'
  | 'Busy'
  | 'Restarting'
  | 'Failed'
  | 'Unsupported';

export interface EngineHealthInfo {
  status: EngineHealthStatus;
  lastRestartAt?: Date;
  restartCount: number;
  lastError?: Error;
}
