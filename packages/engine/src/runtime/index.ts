import { IEngineSession } from '../sessions';
import { IEngineRegistry } from '../registry';
import { IEngineScheduler } from '../scheduler';
import { IEngineMetrics } from '../metrics';

export interface IEngineRuntime {
  readonly registry: IEngineRegistry;
  readonly scheduler: IEngineScheduler;
  
  createSession(engineId: string): Promise<IEngineSession>;
  getMetrics(): IEngineMetrics;
  
  shutdown(): Promise<void>;
}
