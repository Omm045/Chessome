export interface AnalyzeRequestOptionsDto {
  depth?: number;
  engineId?: string;
  multiPv?: number;
}

export interface AnalyzeRequestDto {
  type: 'pgn' | 'fen';
  data: string;
  options?: AnalyzeRequestOptionsDto;
}

export interface AnalysisCreatedResponseDto {
  sessionId: string;
  status: 'queued' | 'running';
  streamUrl: string;
}

export interface PositionStartedEventDto {
  type: 'PositionStarted';
  ply: number;
}

export interface ProgressUpdatedEventDto {
  type: 'ProgressUpdated';
  ply: number;
  depth: number;
  nodes: number;
  nps: number;
  timeMs: number;
  currentPv: string[];
}

export interface PositionCompletedEventDto {
  type: 'PositionCompleted';
  ply: number;
  evaluation: {
    type: 'cp' | 'mate';
    value: number;
  };
  bestMove: string;
  fen: string;
  san: string;
  classification?: 'brilliant' | 'good' | 'inaccuracy' | 'mistake' | 'blunder';
}

export interface AnalysisCompletedEventDto {
  type: 'AnalysisCompleted';
  reportUrl: string;
}

export interface AnalysisFailedEventDto {
  type: 'AnalysisFailed';
  error: string;
}

export type AnalysisEventDto = 
  | PositionStartedEventDto
  | ProgressUpdatedEventDto
  | PositionCompletedEventDto
  | AnalysisCompletedEventDto
  | AnalysisFailedEventDto;

export interface AnalysisReportDto {
  sessionId: string;
  totalPositions: number;
  accuracy?: number;
  opening?: {
    eco: string;
    name: string;
  };
  evaluations: PositionCompletedEventDto[];
}
