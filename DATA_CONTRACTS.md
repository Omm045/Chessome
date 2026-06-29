# Chessome: Data Contracts

## 1. Philosophy
To prevent drift between the Next.js Frontend, NestJS Backend, and Background Workers, all core data structures are defined centrally in `packages/core`. These are exported as TypeScript Interfaces and validated at runtime using Zod schemas.

## 2. Core Domain Contracts

### 2.1 Engine Evaluation
Represents a single snapshot of an engine's thought process at a specific depth.

```typescript
export interface EngineEvaluation {
  /** The FEN string of the position being evaluated */
  fen: string;
  /** The depth reached by the engine */
  depth: number;
  /** Selective depth reached */
  seldepth: number;
  /** MultiPV index (1 for best move, 2 for second best, etc.) */
  multipv: number;
  /** Normalized score. Always relative to White. */
  score: {
    type: 'cp' | 'mate';
    value: number; 
  };
  /** Win/Draw/Loss probabilities (if supported by engine) */
  wdl?: {
    win: number;
    draw: number;
    loss: number;
  };
  /** Total nodes searched */
  nodes: number;
  /** Nodes per second */
  nps: number;
  /** Time taken in milliseconds */
  time: number;
  /** The Principal Variation (array of UCI moves e.g., ["e2e4", "e7e5"]) */
  pv: string[];
}
```

### 2.2 Move Review & Classification
Represents the analysis of a specific move made by a human, compared against the engine's best move.

```typescript
export enum MoveClassification {
  Brilliant = 'brilliant',
  Great = 'great',
  Best = 'best',
  Excellent = 'excellent',
  Good = 'good',
  Book = 'book',
  Inaccuracy = 'inaccuracy',
  Mistake = 'mistake',
  Blunder = 'blunder',
  Miss = 'miss'
}

export interface MoveReview {
  /** The ply (half-move number, e.g., 1 for White's first move) */
  ply: number;
  /** The SAN notation of the move played (e.g., "Nf3") */
  playedMoveSan: string;
  /** The classification assigned by the Analysis Pipeline */
  classification: MoveClassification;
  /** The engine evaluation AFTER the played move */
  evaluation: EngineEvaluation;
  /** The engine's preferred best move (if different from played) */
  bestMoveSan?: string;
  /** The loss in Win Probability caused by this move (used for CAPS) */
  winProbabilityLoss: number;
}
```

### 2.3 Game Review (Accuracy Report)
The aggregated analysis result for an entire game.

```typescript
export interface GameReview {
  gameId: string;
  /** CAPS / Accuracy Score (0-100) */
  accuracy: {
    white: number;
    black: number;
  };
  /** Tallies of move classifications */
  summary: {
    white: Record<MoveClassification, number>;
    black: Record<MoveClassification, number>;
  };
  /** Array of reviewed moves */
  moves: MoveReview[];
}
```

### 2.4 Cloud Analysis Job
The payload sent to the BullMQ Redis queue.

```typescript
export interface CloudAnalysisJob {
  jobId: string;
  priority: number;
  /** The FEN to analyze */
  fen: string;
  /** Target depth to reach before completing the job */
  targetDepth: number;
  /** Optional time limit in milliseconds */
  timeLimitMs?: number;
  /** Engine capability requirements */
  engineRequirements: {
    name?: string; // e.g., "stockfish"
    cpuType?: 'avx2' | 'avx512' | 'any';
    requiresGpu?: boolean;
  };
}
```

## 3. Contract Enforcement
These contracts are converted into Zod schemas (`EngineEvaluationSchema`). The NestJS WebSocket gateway parses every incoming payload from the Redis PubSub through `EngineEvaluationSchema.parse()` before broadcasting it to clients, ensuring malformed worker data never crashes the frontend UI.
