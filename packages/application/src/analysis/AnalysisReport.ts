import { PositionEvaluation } from './PositionEvaluation';

export interface AnalysisMetadata {
  readonly gameId?: string;
  readonly analyzedAt: Date;
  readonly options: {
    readonly depth?: number;
    readonly timeMs?: number;
    readonly nodes?: number;
  };
}

export interface AnalysisSummary {
  readonly totalPositions: number;
  readonly averageDepth: number;
  readonly totalTimeMs: number;
  readonly averageNps: number;
}

export interface EngineInfo {
  readonly name: string;
  readonly version: string;
}

export interface AnalysisReport {
  readonly id: string;
  readonly metadata: AnalysisMetadata;
  readonly summary: AnalysisSummary;
  readonly positions: readonly PositionEvaluation[];
  readonly engineInfo: EngineInfo;
  readonly timing: {
    readonly start: Date;
    readonly end: Date;
    readonly totalMs: number;
  };
  readonly warnings: readonly string[];
  readonly diagnostics: readonly string[];
}
