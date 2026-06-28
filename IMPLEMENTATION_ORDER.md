# Chessome: Implementation Order

To prevent circular dependencies and blocking tasks, the platform MUST be built from the inside out (Domain -> Infrastructure -> Presentation).

### 1. `packages/config`
- **Why First?**: Defines the TypeScript base configuration (`tsconfig.base.json`), ESLint rules, and Prettier formatting. Everything else extends from here.

### 2. `packages/core` (Types & Zod Schemas)
- **Why Next?**: The absolute core of Hexagonal Architecture. The database schema needs to know what an `EngineEvaluation` looks like. The API needs to know the FEN schema. This package can have zero dependencies.

### 3. `packages/database`
- **Why Next?**: Implements Prisma schema. Needs the Zod schemas from `core` to type JSONB columns correctly. Generates the Prisma Client.

### 4. `packages/core` (Domain Logic & PGN Parsing)
- **Why Next?**: The engine adapter needs to know how to validate a legal move before asking Stockfish to evaluate it. We implement the `chess.js` wrappers here.

### 5. `packages/engine-adapters`
- **Why Next?**: Pure infrastructure. Implements `IEngineAdapter` from `core`. Needs the `EngineEvaluation` type from `core`.

### 6. `packages/ui` (Design System)
- **Why Next?**: Independent from the backend. The frontend team can begin building the Chessboard SVG and Radix components in parallel while the backend team finishes the API.

### 7. `apps/api` (NestJS)
- **Why Next?**: The orchestration layer. Imports `packages/database`, `packages/core`, and `packages/engine-adapters`. Wraps them in REST endpoints and WebSockets.

### 8. `apps/worker-analysis`
- **Why Next?**: Imports `packages/database` and `packages/engine-adapters`. Listens to the Redis queue populated by `apps/api`. Cannot be built until the API defines the Job Schema.

### 9. `apps/web` (Next.js Frontend)
- **Why Last?**: Depends on *everything*. It imports `packages/ui` for rendering, `packages/core` for FEN validation before submission, and talks to `apps/api` via HTTP/WebSockets.

### 10. Plugins & Extensibility
- **Why Post-Launch?**: AI Integrations, third-party authentication providers, and data export tools are built on top of the established `apps/api` interfaces.
