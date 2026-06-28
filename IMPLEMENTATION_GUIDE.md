# Chessome: Implementation Guide & Milestones

This guide is the master execution manual for translating the Chessome Architecture into a production-ready repository. Development is strictly phased into Milestones. A Milestone cannot be started until the previous one is merged to `main`.

---

## Milestone 1: Monorepo Foundation & Tooling
- **Purpose**: Establish the physical repository structure and developer environment.
- **Objectives**: A developer can run `pnpm install` and `pnpm dev` without errors.
- **Deliverables**: Empty Next.js app, Empty NestJS app, Turborepo pipeline, Husky pre-commit hooks, ESLint/Prettier configs.
- **Files Created**: `package.json`, `turbo.json`, `.eslintrc.js`, `.prettierrc`, `apps/web/package.json`, `apps/api/package.json`.
- **Dependencies**: `turbo`, `eslint`, `prettier`, `husky`, `lint-staged`.
- **Testing**: Run `pnpm lint` and ensure it passes.
- **Acceptance Criteria**: Pre-commit hook prevents committing a file with a `console.log`.
- **Definition of Done**: PR merged to `main`. CI green.
- **Quality Gates**: Zero TS/Lint errors.
- **Expected Time**: 4 hours.
- **Complexity**: Low.
- **Common Mistakes**: Incorrect TypeScript path aliases in `tsconfig.base.json`.

---

## Milestone 2: Shared Domain & Zod Schemas
- **Purpose**: Implement the Data Contracts as the absolute source of truth before building databases or APIs.
- **Objectives**: Define `EngineEvaluation`, `Game`, and `MoveReview` schemas.
- **Deliverables**: The `packages/core` package with exported Zod schemas and inferred TS types.
- **Files Created**: `packages/core/src/schemas/evaluation.ts`, `packages/core/src/types/index.ts`.
- **Dependencies**: `zod`.
- **Testing**: 100% Unit test coverage on Zod schema parsing (valid and invalid inputs).
- **Rollback Strategy**: N/A (Foundation).

---

## Milestone 3: Data Layer & Persistence
- **Purpose**: Translate the Zod schemas into PostgreSQL tables and establish the caching layer.
- **Objectives**: Create the Prisma schema and Redis clients.
- **Deliverables**: `packages/database` package, DB migrations, Seed scripts.
- **Files Created**: `packages/database/schema.prisma`, `packages/database/src/seed.ts`.
- **Dependencies**: `prisma`, `@prisma/client`, `ioredis`.
- **Testing**: Integration tests using Testcontainers to verify Prisma inserts and Redis TTLs.
- **Common Mistakes**: Forgetting to add `JSONB` indexes on the Evaluation table.

---

## Milestone 4: Chess Domain Logic & Parsing
- **Purpose**: Implement the game rules, PGN parsing, and Move Classification algorithms.
- **Objectives**: The backend can parse a complex PGN string into an AST of FENs.
- **Deliverables**: Pure functions inside `packages/core`.
- **Dependencies**: `chess.js` (wrapped in an adapter).
- **Testing**: Exhaustive unit tests passing real-world PGNs (with nested variations and comments) and verifying exact FEN outputs.
- **Quality Gates**: 95%+ line coverage in `packages/core`.

---

## Milestone 5: The Engine Adapters (WASM & Cloud)
- **Purpose**: Bridge the domain logic with raw Stockfish computation.
- **Objectives**: Implement `LocalWasmAdapter` and `CloudProcessAdapter`.
- **Deliverables**: `packages/engine-adapters` package.
- **Files Created**: `StockfishWasm.ts`, `StockfishProcess.ts`, `UciParser.ts`.
- **Dependencies**: None (Native `child_process` and WebWorkers).
- **Testing**: Playwright test spawning the WebWorker and expecting a `bestmove` event.

---

## Milestone 6: Backend API & WebSocket Gateway
- **Purpose**: Expose the domain logic to the frontend via NestJS.
- **Objectives**: Build the REST API, OAuth flow (NextAuth validation), and Socket.io gateway.
- **Deliverables**: Controllers, Use Cases, and Gateways in `apps/api`.
- **Dependencies**: `@nestjs/core`, `@nestjs/websockets`, `passport`.
- **Testing**: Supertest for REST. Socket.io-client for WebSocket integration tests.
- **Complexity**: High (Stateful WebSocket connections).

---

## Milestone 7: Analysis Workers & Job Scheduler
- **Purpose**: Build the asynchronous BullMQ pipeline.
- **Objectives**: Workers pick up jobs, spawn engines, and stream to Redis PubSub.
- **Deliverables**: `apps/worker-analysis` microservice.
- **Dependencies**: `bullmq`.
- **Review Checklist**: Does the worker aggressively handle OOM crashes? Is the job released?

---

## Milestone 8: Frontend Foundation & Design System
- **Purpose**: Build the UI components.
- **Objectives**: Implement Tailwind, Radix primitives, and the custom SVG Chessboard.
- **Deliverables**: `packages/ui` package.
- **Dependencies**: `tailwindcss`, `lucide-react`, `zustand`.
- **Testing**: Storybook or Playwright component tests for the Chessboard (dragging pieces).

---

## Milestone 9: The Game Review UI
- **Purpose**: Connect the frontend to the backend via WebSockets.
- **Objectives**: A user uploads a PGN, the UI shows the evaluation bar filling up in real-time.
- **Deliverables**: `apps/web` Analysis pages.
- **Common Mistakes**: Binding the high-frequency Evaluation stream directly to React `setState` (must use DOM refs).

---

## Milestone 10: AI Coach Integration
- **Purpose**: Add the BYOK natural language explainer.
- **Objectives**: Implement prompt injection, OpenAI/Anthropic routing, and SSE streaming.
- **Deliverables**: `features/ai-coach` in `apps/api` and `apps/web`.
- **Quality Gates**: Ensure API keys are strictly passed via headers and dropped immediately.
