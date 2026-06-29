import { IEngineProcess } from './index';
import { IUCITransport, NodeProcessTransport } from '../transports';

export class EngineProcess implements IEngineProcess {
  public transport: IUCITransport;
  public isRunning: boolean = false;

  constructor(private readonly command: string, private readonly args: string[] = []) {
    this.transport = new NodeProcessTransport(this.command, this.args);
  }

  public async spawn(): Promise<void> {
    await this.transport.connect();
    this.isRunning = true;
  }

  public async kill(): Promise<void> {
    await this.transport.disconnect();
    this.isRunning = false;
  }

  public async restart(): Promise<void> {
    await this.kill();
    await this.spawn();
  }
}
