# Chessome: Analysis Pipeline

## 1. Overview
The Analysis Pipeline is responsible for taking a raw chess game (PGN) and transforming it into a rich, annotated Game Review complete with Move Classifications (Blunder, Brilliant, etc.), Accuracy Scores (CAPS), and Opening detection.

## 2. Pipeline Stages

### Stage 1: Ingestion & Parsing
- Receive PGN string or FEN.
- Parse using a strict chess rules engine (e.g., `chess.js` or a custom high-performance Rust/WASM parser).
- Validate legality of all moves.
- Identify the Opening using an ECO (Encyclopedia of Chess Openings) Radix Tree.

### Stage 2: Queueing (For Cloud Analysis)
- If running on the cloud, the parsed game is split into discrete positions.
- A job is submitted to Redis BullMQ: `GameAnalysisJob`.
- **Optimization**: The job orchestrator first checks the Global Position Cache. If 30 out of 40 moves are already cached at the requested depth, only the 10 unknown positions are queued.

### Stage 3: Evaluation Generation
- For each position, the Engine calculates the evaluation for the *played* move, and the *best* move (MultiPV = 1 or 2).
- The engine runs until it hits the target `depth` or `time_limit`.

### Stage 4: Move Classification
- Compares the evaluation of position $N$ to position $N+1$.
- Calculates the absolute Centipawn Loss (CPL) and the Shift in Win Probability.
- Classifies the move using threshold logic:
  - **Best**: Played move matches the engine's top choice.
  - **Excellent/Good**: Slight CPL.
  - **Inaccuracy**: Noticeable CPL but no major shift in outcome.
  - **Mistake**: Large CPL, turning a win into a draw, or draw into a loss.
  - **Blunder**: Massive CPL, hanging material or mate.
  - **Miss**: Failed to find a forced tactical sequence.
  - **Brilliant**: A sacrifice that the engine initially dislikes at low depth but validates at high depth.

### Stage 5: Accuracy Calculation
- Aggregates the Win Probability shifts across all moves.
- Applies an exponential decay formula to heavily penalize blunders while smoothing out minor inaccuracies.
- Generates a final score (0-100) for both White and Black.

## 3. Background Workers
- Written in Node.js, utilizing `worker_threads` or separate processes.
- They listen to Redis queues.
- They are stateless and idempotent; if a worker crashes mid-game, the job is returned to the queue and retried without data corruption.

## 4. Architectural Decision Records (ADR)

### ADR-PIPE-001: Win Probability (WDL) over Centipawns for Classification
- **Why it exists**: A 200-centipawn loss in an equal position (+0.0 to -2.0) is a massive blunder. A 200-centipawn loss in a completely winning position (+8.0 to +6.0) is irrelevant and should just be considered "Good" or "Inaccuracy".
- **Trade-offs**: WDL curves require complex mathematical calibration based on engine strength and Elo levels.
- **Alternative approaches**: Fixed centipawn thresholds (e.g., >300cp = blunder).
- **Future scalability**: WDL naturally adapts to endgame tablebases (where everything is exactly 100% win, draw, or loss).
- **Risks**: Users comparing CAPS to other platforms will see different numbers, leading to confusion.
- **Engineering justification**: The pipeline will convert all CP scores to Win Probabilities using the standard Stockfish WDL formula before classifying moves. Move classifications will be based entirely on the delta of Win Probability, ensuring context-aware grading.

### ADR-PIPE-002: Batch vs Streaming Analysis Responses
- **Why it exists**: Game reviews can take 30-60 seconds. Users want immediate feedback.
- **Trade-offs**: Streaming requires WebSocket infrastructure and complex frontend state merging.
- **Alternative approaches**: Wait for the entire pipeline to finish, then return a massive JSON payload.
- **Future scalability**: Streaming allows the user to start reviewing the opening while the endgame is still being calculated by the workers.
- **Risks**: Out-of-order message delivery in WebSockets.
- **Engineering justification**: The Analysis Pipeline will emit events per-move. The frontend will build the Game Review UI incrementally. Each WebSocket message will contain the `ply` (move number) to ensure the frontend can correctly sort out-of-order evaluations.
