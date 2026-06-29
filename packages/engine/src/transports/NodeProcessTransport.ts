import { ChildProcess, spawn } from 'child_process';
import { IUCITransport } from './index';
import * as readline from 'readline';

export class NodeProcessTransport implements IUCITransport {
  private process: ChildProcess | null = null;
  private messageCallback: ((message: string) => void) | null = null;
  private errorCallback: ((err: Error) => void) | null = null;
  private rl: readline.Interface | null = null;

  constructor(private readonly command: string, private readonly args: string[] = []) {}

  public async connect(): Promise<void> {
    if (this.process) return;

    return new Promise((resolve, reject) => {
      try {
        this.process = spawn(this.command, this.args);
        
        this.process.on('error', (err) => {
          if (this.errorCallback) this.errorCallback(err);
          reject(err);
        });
        
        this.process.on('exit', (code, signal) => {
          if (code !== 0 && code !== null) {
            if (this.errorCallback) this.errorCallback(new Error(`Process exited with code ${code}`));
          } else if (signal) {
            if (this.errorCallback) this.errorCallback(new Error(`Process killed by signal ${signal}`));
          }
        });

        if (this.process.stdout) {
          this.rl = readline.createInterface({
            input: this.process.stdout,
            terminal: false
          });

          this.rl.on('line', (line) => {
            if (this.messageCallback) {
              this.messageCallback(line);
            }
          });
        }

        // Wait a short moment to ensure process spawned correctly
        setTimeout(() => resolve(), 50);
      } catch (err) {
        reject(err);
      }
    });
  }

  public async disconnect(): Promise<void> {
    if (this.rl) {
      this.rl.close();
      this.rl = null;
    }
    
    if (this.process) {
      this.process.kill();
      this.process = null;
    }
  }

  public async send(command: string): Promise<void> {
    if (!this.process || !this.process.stdin) {
      throw new Error('Transport not connected');
    }
    this.process.stdin.write(command + '\n');
  }

  public onMessage(callback: (message: string) => void): void {
    this.messageCallback = callback;
  }

  public onError(callback: (err: Error) => void): void {
    this.errorCallback = callback;
  }
}
