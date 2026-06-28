export interface IUCITransport {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  send(command: string): Promise<void>;
  onMessage(callback: (message: string) => void): void;
}
