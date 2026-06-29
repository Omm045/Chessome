import { AnalysisReport, AnalysisSummary, AnalysisMetadata, EngineInfo } from './AnalysisReport';
import { PositionEvaluation } from './PositionEvaluation';

export class ResultAggregator {
  private positions: PositionEvaluation[] = [];
  private warnings: string[] = [];
  private diagnostics: string[] = [];
  
  constructor(
    private readonly id: string,
    public readonly metadata: AnalysisMetadata,
    private readonly engineInfo: EngineInfo,
    private readonly startTime: Date
  ) {}

  public addEvaluation(evaluation: PositionEvaluation): void {
    this.positions.push(evaluation);
  }

  public addWarning(warning: string): void {
    this.warnings.push(warning);
  }

  public addDiagnostic(diagnostic: string): void {
    this.diagnostics.push(diagnostic);
  }

  public get count(): number {
    return this.positions.length;
  }

  public buildReport(): AnalysisReport {
    const endTime = new Date();
    const totalMs = endTime.getTime() - this.startTime.getTime();
    
    let totalDepth = 0;
    let totalNps = 0;
    for (const pos of this.positions) {
      totalDepth += pos.depth;
      totalNps += pos.nps;
    }

    const count = this.positions.length || 1; // prevent divide by zero
    const averageDepth = totalDepth / count;
    const averageNps = totalNps / count;

    const summary: AnalysisSummary = {
      totalPositions: this.positions.length,
      averageDepth,
      totalTimeMs: totalMs,
      averageNps
    };

    return {
      id: this.id,
      metadata: this.metadata,
      summary,
      positions: [...this.positions],
      engineInfo: this.engineInfo,
      timing: {
        start: this.startTime,
        end: endTime,
        totalMs
      },
      warnings: [...this.warnings],
      diagnostics: [...this.diagnostics]
    };
  }
}
