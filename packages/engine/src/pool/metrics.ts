export interface PoolMetrics {
  readonly poolUtilizationPercent: number;
  readonly warmPoolSize: number;
  readonly sessionLeaseTimeMs: number;
  readonly queueWaitTimeMs: number;
  readonly averageSearchTimeMs: number;
  readonly engineRestartCount: number;
  readonly crashRatePercent: number;
  readonly sessionReuseRatio: number;
  readonly poolExpansionCount: number;
  readonly idleTimeMs: number;
}

export interface PoolConfig {
  readonly minInstances: number;
  readonly maxInstances: number;
  readonly idleTimeoutMs: number;
  readonly warmCount: number;
}
