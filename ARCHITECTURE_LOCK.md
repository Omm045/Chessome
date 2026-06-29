# ARCHITECTURE_LOCK.md

**Date:** June 29, 2026
**Status:** LOCKED
**Scope:** Backend Infrastructure, Domain Model, Event System, Engine Orchestration

## 1. Zero-Mock Rule
All integration tests and orchestration layers must use real implementations of `IEnginePool`, `IEngineSession`, `IEngineProcess`, `UciDecoder`, `ReplayIterator`, and `FenParser`. Mocks are only allowed for external boundaries such as the cloud infrastructure (e.g. Postgres DB or cloud queue) or to resolve paths to downloaded binaries.

## 2. Dependency Graph Boundaries
The application is strictly layered and no package from a lower layer is permitted to import a higher layer.
- `@chessome/shared` / `@chessome/types`: Foundation. Zero dependencies.
- `@chessome/events`: Core event definitions. Minimal dependencies.
- `@chessome/ports`: Abstract infrastructure interfaces. Zero concrete domain logic.
- `@chessome/chess`: Domain model (`Position`, `Move`, `Board`, `ReplayIterator`). It has NO dependency on `@chessome/engine` or `@chessome/application`.
- `@chessome/fen` / `@chessome/pgn`: Parsers. They construct the `Position` and `GameNode` ASTs.
- `@chessome/engine`: The UCI integration layer. Manages processes, transports, sessions, pooling, and parses raw standard output via `UciDecoder`.
- `@chessome/application`: The orchestration layer. Connects `ReplayIterator`, `EngineRuntime`, `EngineExecutor`, and `AnalysisCoordinator` together. 

## 3. Data Flow
1. **PGN Input** → `PgnParser` → **AST**
2. **AST** → `Domain Mapper` → **Domain Moves**
3. **Domain Moves + Position** → `ReplayIterator`
4. `ReplayIterator` → yields **PositionStates**
5. **PositionState** → `EnginePositionMapper` → **FEN string**
6. **FEN string** → `AnalysisCoordinator` → `EngineExecutor` → `EngineSession`
7. `EngineSession` → `NodeProcessTransport` → **Real Stockfish Process**
8. **Stockfish stdout** → `NodeProcessTransport` → `UciDecoder`
9. `UciDecoder` → `EngineSessionEvents` → `EngineExecutor`
10. `EngineExecutor` → `AnalysisCoordinator` → `ResultAggregator`
11. `ResultAggregator` → **AnalysisReport**

## 4. Stability
No new abstractions or redesigns are allowed for the backend architecture. Future work must focus solely on:
- Product feature logic
- Cloud persistence integration
- React UI integration
- Performance tuning
- Bug fixes within the locked boundaries
