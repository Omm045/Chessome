export type DiagnosticSeverity = 'error' | 'warning' | 'info';

export type FenField = 'PiecePlacement' | 'ActiveColor' | 'CastlingRights' | 'EnPassant' | 'HalfmoveClock' | 'FullmoveNumber' | 'Global';

export interface FenDiagnostic {
  readonly field: FenField;
  readonly severity: DiagnosticSeverity;
  readonly message: string;
}

export class FenParseError extends Error {
  constructor(
    message: string,
    public readonly diagnostics: FenDiagnostic[]
  ) {
    super(message);
    this.name = 'FenParseError';
  }
}
