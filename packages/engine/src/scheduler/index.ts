import { ISchedulerPolicy } from './policy';
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { ILeasedSession } from '../pool';

export interface SchedulerConfig {
  readonly maxQueueSize: number;
  readonly defaultTimeoutMs: number;
}

export interface IEngineScheduler {
  readonly policy: ISchedulerPolicy;
  readonly config: SchedulerConfig;
  
  /**
   * Enqueues a request for a session. Blocks until a session is allocated or the timeout expires.
   * Provides backpressure when the underlying pool is saturated.
   * @param pluginId The requested engine plugin.
   * @param timeoutMs The max time to wait in the queue before failing.
   */
  requestSession(pluginId: string, timeoutMs?: number): Promise<ILeasedSession>;
  
  /**
   * Returns current scheduler queue statistics.
   */
  getQueueLength(): number;
}

export class EngineScheduler implements IEngineScheduler {
  constructor(
    public readonly policy: ISchedulerPolicy,
    public readonly config: SchedulerConfig,
    private readonly pool: any // IEnginePool in practice
  ) {}

  async requestSession(pluginId: string, timeoutMs?: number): Promise<ILeasedSession> {
    // Basic implementation: directly lease from pool without queueing for now
    return this.pool.leaseSession(pluginId);
  }

  getQueueLength(): number {
    return 0;
  }
}

export * from './policy';

