import { IUCITransport } from '../transports';

export interface IEngineProcess {
  readonly transport: IUCITransport;
  readonly isRunning: boolean;
  
  spawn(): Promise<void>;
  kill(): Promise<void>;
  restart(): Promise<void>;
}

export * from './EngineProcess';
