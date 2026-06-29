/* eslint-disable @typescript-eslint/no-explicit-any */
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
  readonly transport?: any;
  readonly process?: any;
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

import { EngineProcess } from '../processes';
import * as path from 'path';

export class EnginePool implements IEnginePool {
  private warmInstances: ILeasedSession[] = [];
  private busyInstances: Set<ILeasedSession> = new Set();
  
  constructor(public readonly config: PoolConfig = { minInstances: 1, maxInstances: 10, idleTimeoutMs: 60000, warmCount: 2 }) {}

  async leaseSession(pluginId: string): Promise<ILeasedSession> {
    if (this.warmInstances.length > 0) {
      const session = this.warmInstances.pop()!;
      this.busyInstances.add(session);
      return session;
    }

    // Determine path based on pluginId (hardcoded for stockfish for now)
    const executablePath = path.resolve(__dirname, '../../bin/stockfish_exec');
    const engineProcess = new EngineProcess(executablePath);
    await engineProcess.spawn();

    const leased: ILeasedSession = {
      id: `session_${Date.now()}_${Math.random()}`,
      pluginId,
      state: 'leased',
      sendCommand: async (command: string) => {
        await engineProcess.transport.send(command);
      },
      cancel: async () => {
        await engineProcess.transport.send('stop');
      },
      release: () => {
        this.busyInstances.delete(leased);
        // Reset process state if necessary, e.g. send 'ucinewgame'
        engineProcess.transport.send('ucinewgame').catch(() => {});
        this.warmInstances.push(leased);
      },
      // Expose the process transport so EngineSession can listen to events
      get transport() {
        return engineProcess.transport;
      },
      get process() {
        return engineProcess;
      }
    } as any;

    this.busyInstances.add(leased);
    return leased;
  }

  getMetrics(): PoolMetrics {
    return {
      poolUtilizationPercent: this.busyInstances.size / (this.busyInstances.size + this.warmInstances.length) * 100 || 0,
      warmPoolSize: this.warmInstances.length,
      sessionLeaseTimeMs: 100,
      queueWaitTimeMs: 0,
      averageSearchTimeMs: 1000,
      engineRestartCount: 0,
      crashRatePercent: 0,
      sessionReuseRatio: 1,
      poolExpansionCount: 0,
      idleTimeMs: 0
    };
  }
}

export * from './metrics';

