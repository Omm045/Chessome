export type DiagnosticSeverity = 'error' | 'warning' | 'info';

export interface PgnDiagnostic {
  readonly line: number;
  readonly column: number;
  readonly severity: DiagnosticSeverity;
  readonly message: string;
  readonly recoveryAttempted: boolean;
}

export class PgnParseError extends Error {
  constructor(
    message: string,
    public readonly diagnostics: PgnDiagnostic[]
  ) {
    super(message);
    this.name = 'PgnParseError';
  }
}
