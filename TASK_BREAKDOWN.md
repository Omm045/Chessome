# Chessome: Feature Breakdown & Micro-Tasks

Every major feature must be broken down into independently testable micro-tasks. A developer should be able to pick up a task, complete it in 30–90 minutes, and open a PR.

## Feature: Core Engine Abstraction (WASM)

### Task 1: Define `IEngineAdapter`
- **Description**: Create the TypeScript interface defining `setPosition`, `evaluate`, and `stop`.
- **Expected Time**: 30m.
- **Verification**: Ensure the interface aligns exactly with `EngineEvaluation` Zod schema.

### Task 2: Implement UCI Parser Utility
- **Description**: Write a pure function that takes a raw UCI string (e.g., `info depth 10 seldepth 14 multipv 1 score cp 34 nodes 1234`) and returns a partial `EngineEvaluation` object.
- **Expected Time**: 60m.
- **Verification**: Unit tests covering CP scores, Mate scores, and missing optional fields.

### Task 3: Build `LocalWasmAdapter` (WebWorker)
- **Description**: Implement `IEngineAdapter` by spawning a WebWorker that loads `stockfish.wasm`.
- **Expected Time**: 90m.
- **Verification**: Write a Playwright test that loads the adapter in a browser context and verifies it emits `EvaluationProduced` events.

## Feature: Cloud Analysis Scheduler

### Task 4: Define BullMQ Job Schemas
- **Description**: Create Zod schemas for `AnalysisJobData` and `AnalysisJobResult`.
- **Expected Time**: 30m.
- **Verification**: Zod `.parse()` unit tests.

### Task 5: Implement `JobProcessor` (Worker Node)
- **Description**: Write the BullMQ processor function that accepts an `AnalysisJobData`, spawns `StockfishProcessAdapter`, and streams results to Redis PubSub.
- **Expected Time**: 90m.
- **Verification**: Integration test using a local Redis container to verify the job completes and PubSub receives messages.

### Task 6: Implement Priority Queueing (API Node)
- **Description**: Create the NestJS Service that pushes jobs to the BullMQ queue with correct priority flags (Interactive vs Background).
- **Expected Time**: 60m.
- **Verification**: Integration test verifying BullMQ correctly sorts Priority 1 jobs ahead of Priority 3 jobs.

## Feature: The Game Review UI

### Task 7: Build `useAnalysisStore` (Zustand)
- **Description**: Create the client-side state store holding the current FEN, move tree, and active ply.
- **Expected Time**: 60m.
- **Verification**: Unit tests for the reducers (`nextMove`, `previousMove`, `addVariation`).

### Task 8: Build the SVG Chessboard
- **Description**: Implement a dumb React component that takes a FEN string and renders the 64 squares and pieces using CSS Grid.
- **Expected Time**: 90m.
- **Verification**: Storybook rendering of starting position and complex endgames.

### Task 9: Implement Evaluation Bar (DOM Mutation)
- **Description**: Create the Evaluation Bar component that uses a `useRef` to directly manipulate its CSS `height` based on engine events, bypassing React state.
- **Expected Time**: 60m.
- **Verification**: Playwright test asserting the DOM element's height changes when a mock WebSocket event is fired.
