export interface IEngineOptions {
  threads?: number;
  hash?: number;
  multiPv?: number;
  syzygyPath?: string;
  options?: Record<string, string | number | boolean>;
}

export interface IEngineAdapter {
  initialize(options: IEngineOptions): Promise<void>;
  isReady(): Promise<boolean>;
  setOption(name: string, value: string | number | boolean): Promise<void>;
  startAnalysis(fen: string, searchParams: EngineSearchParams): Promise<void>;
  stopAnalysis(): Promise<void>;
  quit(): Promise<void>;
}

export interface EngineSearchParams {
  depth?: number;
  nodes?: number;
  timeMs?: number;
  infinite?: boolean;
}
