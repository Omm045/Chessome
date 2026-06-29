export type FenDiagnosticSeverity = 'error' | 'warning' | 'info';

export interface FenDiagnostic {
  field: 'Global' | 'PiecePlacement' | 'ActiveColor' | 'CastlingRights' | 'EnPassant' | 'HalfmoveClock' | 'FullmoveNumber';
  severity: FenDiagnosticSeverity;
  message: string;
}

export class FenParseError extends Error {
  constructor(message: string, public readonly diagnostics: FenDiagnostic[]) {
    super(message);
    this.name = 'FenParseError';
  }
}
