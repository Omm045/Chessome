import { ILogger } from '@chessome/shared';

export class FakeLogger implements ILogger {
  public debugLogs: string[] = [];
  public infoLogs: string[] = [];
  public warnLogs: string[] = [];
  public errorLogs: string[] = [];

  debug(message: string, context?: string): void {
    this.debugLogs.push(context ? `[${context}] ${message}` : message);
  }

  info(message: string, context?: string): void {
    this.infoLogs.push(context ? `[${context}] ${message}` : message);
  }

  warn(message: string, context?: string): void {
    this.warnLogs.push(context ? `[${context}] ${message}` : message);
  }

  error(message: string, trace?: string, context?: string): void {
    this.errorLogs.push(context ? `[${context}] ${message}` : message);
  }
}
