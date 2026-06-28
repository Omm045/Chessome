import { PoolMetrics, PoolConfig } from './metrics';

export type SessionState = 'leased' | 'draining' | 'released' | 'faulted';

export interface ILeasedSession {
  readonly id: string;
  readonly pluginId: string;
  readonly state: SessionState;
  
  /**
   * Sends a raw UCI command into this leased session.
   */
  sendCommand(command: string): Promise<void>;
  
  /**
   * Safely cancels the current operation (sends 'stop', drains output, prepares for release).
   */
  cancel(): Promise<void>;
  
  /**
   * Releases the session back to the pool. Must be called when finished.
   */
  release(): void;
}

export interface IEnginePool {
  readonly config: PoolConfig;
  
  /**
   * Leases a session from the pool for the specified plugin.
   * Internally manages Cold -> Warm -> Busy state transitions.
   */
  leaseSession(pluginId: string): Promise<ILeasedSession>;
  
  /**
   * Returns current utilization and performance metrics of the pool.
   */
  getMetrics(): PoolMetrics;
}

export * from './metrics';
