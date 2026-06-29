# Chessome: Development Roadmap & Phases

This document outlines the strict phased implementation plan. **Nothing may proceed to the next phase until the previous phase passes every quality gate.**

---

## Phase 1: Core Foundation & Data Layer
**Purpose**: Establish the monorepo, database schema, and strict coding standards. No UI is built here.
**Features**:
- Turborepo setup (Next.js empty app, NestJS empty API).
- Prisma schema generation (Users, Games, Positions, Evaluations).
- Core chess logic (`packages/core`): FEN validation, PGN parsing interface.
**Deliverables**:
- Passing CI pipeline.
- PostgreSQL and Redis Docker setups.
- Unit tests for PGN/FEN utilities (100% coverage).
**Quality Gates**: Zero TS errors, Zero ESLint errors.

---

## Phase 2: Engine Integration & Analysis Pipeline
**Purpose**: Build the brain of the platform. Implement the Headless Analysis system.
**Features**:
- `IEngineAdapter` interface.
- Local WASM Stockfish Adapter.
- Move Classification logic (WDL calculation).
- Accuracy scoring formula.
**Deliverables**:
- Given a PGN string in a unit test, the pipeline outputs a JSON Game Review with classifications and accuracy scores.
**Quality Gates**: Pipeline must evaluate a 40-move game accurately without memory leaks in the WASM worker.

---

## Phase 3: The API & Backend Services
**Purpose**: Expose the core domain to the web.
**Features**:
- NestJS REST endpoints (Game CRUD, User Profile).
- OAuth integration (Chess.com/Lichess).
- Redis Job Queue for async cloud analysis.
- WebSocket gateway for live evaluation streaming.
**Deliverables**:
- Swagger/OpenAPI documentation.
- Testcontainers integration tests for all endpoints.
**Quality Gates**: API response time < 100ms for cached routes. WebSocket broadcast latency < 50ms.

---

## Phase 4: Frontend UI & The Chessboard
**Purpose**: Build the visual interface and design system.
**Features**:
- Tailwind/Radix Design System (`packages/ui`).
- Custom SVG/CSS Grid Chessboard component.
- Piece dragging, legal move visualization, arrow drawing.
- Integration with Zustand for board state.
**Deliverables**:
- A fully playable local chessboard.
- Responsive design (Mobile & Desktop).
**Quality Gates**: Board renders in < 50ms. Piece dragging maintains 60fps on mobile. 100% WCAG AA Accessibility.

---

## Phase 5: Game Review & Real-time Integration
**Purpose**: Connect the frontend to the analysis pipeline.
**Features**:
- The Game Review UI (Evaluation bar, Move list, Classifications).
- Real-time engine toggle (Web Workers).
- Connecting to the WebSocket for cloud evaluations.
**Deliverables**:
- A user can paste a FEN/PGN and see the board evaluate in real-time.
**Quality Gates**: The evaluation bar DOM updates must bypass React state to ensure the UI does not freeze during engine calculations.

---

## Phase 6: AI Integration (BYOK)
**Purpose**: Implement the optional natural language coach.
**Features**:
- API Key management UI (localStorage).
- `IAIProvider` adapters (OpenAI, Anthropic).
- Prompt generation engine.
- Coach Chat UI.
**Deliverables**:
- Clicking "Explain this mistake" generates a stream of text explaining the engine PV.
**Quality Gates**: The AI must never contradict the engine evaluation. Prompt injection protections in place.

---

## Phase 7: Polish, Launch & Open Source
**Purpose**: Prepare for public release.
**Features**:
- Writing `CONTRIBUTING.md` and repository guidelines.
- Setting up Terraform for production.
- Stress testing.
**Deliverables**:
- `v1.0.0` release.
- Self-hosting documentation (Docker Compose).
**Rollback Plan**: If production fails, revert to previous Docker image tag via Kubernetes.
