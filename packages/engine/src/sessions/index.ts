/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
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

export class EngineSession implements IEngineSession {
  public isAnalyzing = false;
  private process: any; // IEngineProcess (injected or passed in)
  
  constructor(
    public readonly id: string,
    public readonly events: IEngineSessionEvents,
    process: any // Injected
  ) {
    this.process = process;
    
    // Wire up events from the process to the session events
    this.process.transport.onMessage((line: string) => {
      // Decode and dispatch
      // In a real implementation this would use UciDecoder and trigger this.events.emit(...)
    });
    
    if (this.process.transport.onError) {
      this.process.transport.onError((err: Error) => {
        (this.events as any).emit('Failed', { sessionId: this.id, error: err.message });
      });
    }
  }

  async configure(options: IEngineOptions): Promise<void> {
    for (const [key, value] of Object.entries(options.options || {})) {
      await this.process.transport.send(`setoption name ${key} value ${value}`);
    }
  }

  async analyze(fen: string, searchParams: EngineSearchParams): Promise<void> {
    this.isAnalyzing = true;
    await this.process.transport.send(`position fen ${fen}`);
    
    let goCommand = 'go';
    if (searchParams.depth) goCommand += ` depth ${searchParams.depth}`;
    if (searchParams.timeMs) goCommand += ` movetime ${searchParams.timeMs}`;
    if (searchParams.nodes) goCommand += ` nodes ${searchParams.nodes}`;
    if (searchParams.infinite) goCommand += ` infinite`;
    
    await this.process.transport.send(goCommand);
  }

  async stop(): Promise<void> {
    if (this.isAnalyzing) {
      await this.process.transport.send('stop');
      this.isAnalyzing = false;
    }
  }

  async pause(): Promise<void> {}
  async resume(): Promise<void> {}
  async cancel(): Promise<void> {
    await this.stop();
  }
  async dispose(): Promise<void> {
    await this.cancel();
    await this.process.kill();
  }
}

