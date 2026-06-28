export interface CrashMetrics {
  readonly crashes: number;
  readonly lastCrashTime?: Date;
  readonly firstCrashTime?: Date;
}

export interface IRestartPolicy {
  /**
   * Determines if the engine should be restarted based on the crash history.
   * If true, it might also return a delay in milliseconds for backoff.
   */
  shouldRestart(metrics: CrashMetrics): { restart: boolean; backoffMs: number };
}

export interface IEngineRecoveryManager {
  readonly policy: IRestartPolicy;
  
  recordCrash(pluginId: string, error: Error): void;
  getMetrics(pluginId: string): CrashMetrics;
  resetMetrics(pluginId: string): void;
}
