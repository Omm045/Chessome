# Chessome: Testing Strategy

## 1. Philosophy
Chessome maintains strict quality gates. A bug in the core chess logic or engine parsing invalidates the entire purpose of the platform. Testing is not an afterthought; it is a mandatory part of the Definition of Done.

## 2. Testing Layers

### 2.1 Unit Testing (Vitest/Jest)
- **Scope**: Pure functions, domain logic, FEN parsing, move validation, and Redux/Zustand reducers.
- **Tools**: `vitest` (Fast, native ESM support).
- **Coverage Goal**: 90%+ on `packages/core`. Pure domain logic must be bulletproof.
- **Example**: Asserting that parsing an invalid FEN throws a specific `InvalidFenError`.

### 2.2 Integration Testing
- **Scope**: Database interactions, API endpoints, and Plugin Adapters.
- **Tools**: Supertest, Testcontainers (for spinning up a real PostgreSQL and Redis instance during tests).
- **Mocking Strategy**: We mock external APIs (e.g., Chess.com API) but we **never mock the database** for integration tests.
- **Example**: Submitting a FEN to the `AnalyzeGameUseCase` and verifying it correctly inserts a job into the Redis queue.

### 2.3 End-to-End (E2E) Testing
- **Scope**: User flows, browser interactions, chessboard rendering.
- **Tools**: **Playwright**.
- **Coverage Goal**: Critical paths only (Login, Import Game, Run Engine, View Report).
- **Example**: Playwright opens a browser, navigates to the board, clicks a piece, moves it, and asserts that the Evaluation Bar updates.

### 2.4 Performance & Stress Testing
- **Scope**: WebSocket connection limits, Engine worker queue throughput.
- **Tools**: **k6**.
- **Example**: Simulating 10,000 concurrent WebSocket connections receiving 4 evaluation updates per second to ensure the NestJS gateway does not crash under memory pressure.

## 3. Architectural Decision Records (ADR)

### ADR-TST-001: Playwright over Cypress
- **Why it exists**: E2E testing of a complex SVG/Canvas chessboard requires precise mouse coordinate emulation and multi-tab testing (e.g., testing real-time synchronization between two tabs).
- **Trade-offs**: Playwright tests can be flaky if UI elements shift slightly.
- **Alternative approaches**: Cypress, Selenium.
- **Future scalability**: Playwright's native support for WebKit, Chromium, and Firefox guarantees the chess engine Web Workers run correctly across all engines.
- **Risks**: Maintaining E2E tests is time-consuming.
- **Engineering justification**: Playwright's architecture allows for native interaction with Web Workers (crucial for testing our WASM Stockfish implementation in the browser), which Cypress struggles with. Playwright is the absolute standard for modern web apps.

### ADR-TST-002: Testcontainers for Database Integration
- **Why it exists**: Mocking Prisma logic (`prisma.user.create.mockResolvedValue(...)`) tests the mock, not the reality. It hides database constraint errors (e.g., unique index violations).
- **Trade-offs**: Tests take slightly longer to boot up the Docker containers.
- **Alternative approaches**: SQLite for testing, mocks.
- **Future scalability**: Guarantees that CI runs the exact same PostgreSQL version as production.
- **Risks**: CI environments must support Docker-in-Docker.
- **Engineering justification**: All API and Database integration tests will use `testcontainers-node` to spin up an ephemeral PostgreSQL instance. Migrations are run, the test executes against a real DB, and the container is destroyed. This ensures absolute confidence in the Data Access Layer.
