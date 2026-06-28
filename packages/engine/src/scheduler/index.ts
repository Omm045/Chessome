import { IEngineProcess } from '../processes';

export interface ISchedulerConfig {
  maxConcurrency: number;
  queueTimeoutMs: number;
}

export interface IEngineScheduler {
  readonly config: ISchedulerConfig;
  
  enqueueWork(request: SchedulerRequest): Promise<IEngineProcess>;
  cancelWork(requestId: string): Promise<void>;
  getActiveWorkers(): number;
  getQueueDepth(): number;
}

export interface SchedulerRequest {
  id: string;
  engineId: string;
  priority: number;
  timeoutMs?: number;
}
