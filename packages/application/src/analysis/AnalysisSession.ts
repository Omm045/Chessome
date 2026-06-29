export class AnalysisSession {
  private isCancelled = false;
  private currentPly = 0;

  constructor(public readonly sessionId: string) {}

  public get cancelled(): boolean {
    return this.isCancelled;
  }

  public cancel(): void {
    this.isCancelled = true;
  }

  public updateCheckpoint(ply: number): void {
    this.currentPly = ply;
  }

  public getCheckpoint(): number {
    return this.currentPly;
  }
}
