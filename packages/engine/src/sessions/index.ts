import { IEngineOptions, EngineSearchParams } from '../adapters';
import { IEngineSessionEvents } from './events';

export interface IEngineSession {
  readonly id: string;
  readonly events: IEngineSessionEvents;
  readonly isAnalyzing: boolean;

  configure(options: IEngineOptions): Promise<void>;
  analyze(fen: string, searchParams: EngineSearchParams): Promise<void>;
  
  stop(): Promise<void>;
  pause(): Promise<void>; // May be no-op if engine doesn't support it natively
  resume(): Promise<void>; // May be no-op
  cancel(): Promise<void>;
  dispose(): Promise<void>;
}
