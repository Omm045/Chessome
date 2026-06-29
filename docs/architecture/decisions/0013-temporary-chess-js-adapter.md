# ADR 0013: Temporary `chess.js` Adapter for MVP Analysis

## Status
Accepted

## Context
During Phase 3.2F (End-to-End Analysis Integration), we needed to feed Stockfish sequential FEN strings and SAN moves by parsing a full PGN game string.

Our native domain packages (`@chessome/pgn`, `@chessome/chess`) are currently incomplete regarding full algebraic notation mapping and FEN generation from an initial starting position through a sequence of moves.

To unblock the flagship Analysis Experience MVP and proceed to Phase 3.2G certification without weeks of domain package parsing development, we temporarily introduced `chess.js` into the API layer (`LiveAnalysisService`) as a stop-gap adapter.

## Decision
We will use `chess.js` inside `LiveAnalysisService` specifically to act as the `PositionProvider`. It parses the incoming PGN, loops over the history, and yields `{ ply, position: { fen }, lastMove: { san } }` for the `AnalysisCoordinator` to ingest.

This is explicitly categorized as **Technical Debt** and should not be allowed to leak into the core domain (`packages/application`, `packages/core`).

## Consequences
- **Positive:** Unblocks the frontend and full-stack integration immediately, allowing us to certify the product UX (Phase 3.2G).
- **Negative:** Adds a third-party domain dependency to the API layer.
- **Mitigation:** We will track the removal of this adapter on the backlog. Once `@chessome/chess` and `@chessome/pgn` are feature-complete, `LiveAnalysisService` will be rewritten to use the native `ReplayIterator` and `PgnParser`.
