export interface IUCITransport {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  send(command: string): Promise<void>;
  onMessage(callback: (message: string) => void): void;
  onError(callback: (err: Error) => void): void;
}

export * from './NodeProcessTransport';
