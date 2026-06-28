export interface IEngineMetrics {
  nps: number;
  nodes: number;
  hashUsageFullMille: number; // usually reported as x/1000
  restarts: number;
  crashes: number;
  queueTimeMs: number;
  sessionCount: number;
  averageDepth: number;
  averagePvLength: number;
}
