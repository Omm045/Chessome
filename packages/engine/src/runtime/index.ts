/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-vars */
import { IEngineSession } from '../sessions';
import { IEngineRegistry } from '../registry';
import { IEngineScheduler } from '../scheduler';
import { IEngineMetrics } from '../metrics';
import { UciDecoder } from '../uci/decoder';

export interface IEngineRuntime {
  readonly registry: IEngineRegistry;
  readonly scheduler: IEngineScheduler;
  
  createSession(engineId: string): Promise<IEngineSession>;
  getMetrics(): IEngineMetrics;
  
  shutdown(): Promise<void>;
}

import { EngineSession } from '../sessions';
import { IEnginePool } from '../pool';

export class EngineRuntime implements IEngineRuntime {
  constructor(
    public readonly registry: IEngineRegistry,
    public readonly scheduler: IEngineScheduler,
    private readonly pool: IEnginePool
  ) {}

  async createSession(engineId: string): Promise<IEngineSession> {
    const plugin = this.registry.resolve(engineId);
    if (!plugin) throw new Error(`Engine ${engineId} not found`);

    // We bypass the scheduler stub for now and lease directly from the pool, 
    // since we need a real leased session with a real process.
    const leased = await this.pool.leaseSession(engineId);
    
    // EngineSession requires id, events, and the process object.
    const EventEmitter = require('events');
    const events = new EventEmitter();
    
    const session = new EngineSession(leased.id, events as any, leased.process);
    
    // We should also hook up the decoder
    leased.transport.onMessage((line: string) => {
      const response = UciDecoder.decode(line);
      if (response.type === 'INFO' && response.metrics) {
        if (response.metrics.depth) events.emit('Depth', { depth: response.metrics.depth, seldepth: response.metrics.seldepth });
        if (response.metrics.pv) events.emit('PV', { pv: response.metrics.pv, scoreCp: response.metrics.score?.value, multipv: response.metrics.multipv });
      } else if (response.type === 'BESTMOVE') {
        events.emit('BestMove', { bestMove: response.bestMove, ponder: response.ponder });
      }
    });

    const originalDispose = session.dispose.bind(session);
    session.dispose = async () => {
      await session.cancel();
      leased.release(); // Return to pool instead of killing
    };

    return session;
  }

  getMetrics(): IEngineMetrics {
    return {
      nps: 0,
      nodes: 0,
      hashUsageFullMille: 0,
      restarts: 0,
      crashes: 0,
      queueTimeMs: 0,
      sessionCount: 0,
      averageDepth: 0,
      averagePvLength: 0
    };
  }

  async shutdown(): Promise<void> {
    // Stub
  }
}

