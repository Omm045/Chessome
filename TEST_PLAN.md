# Chessome: Test Plan & Matrix

Chessome employs a testing pyramid heavily weighted toward Integration Tests, as the interaction between APIs, Queues, and Databases is the primary failure vector.

## 1. Unit Tests (Vitest)

### Scope
- **Domain Logic**: FEN parsing, PGN splitting, move classification (WDL curves).
- **Zod Schemas**: Validation logic for external payloads.
- **Frontend State**: Zustand reducers (`useAnalysisStore`).

### Execution
- Ran on every PR push. Must execute in < 15 seconds.
- Mocking is ALLOWED and ENCOURAGED here.

### Edge Cases to Assert
- PGNs with invalid move strings (must throw explicit `ChessParseError`).
- PGNs missing header tags (e.g., `[Result "*"]`).
- FEN strings missing en-passant squares.

## 2. Integration Tests (Supertest + Testcontainers)

### Scope
- **Database**: Repository layers testing raw SQL inserts and Prisma updates.
- **API Endpoints**: Full HTTP request lifecycle.
- **Queues**: Redis BullMQ job processing.

### Execution
- Ran on PRs touching `apps/api` or `apps/worker-analysis`.
- Mocking the Database or Redis is strictly FORBIDDEN. Uses ephemeral Docker containers (`testcontainers-node`).

### Edge Cases to Assert
- Creating a game that already exists (Unique constraint violations).
- Enqueuing 10,000 jobs (verifying BullMQ rate limit respects).
- API Key missing or invalid formats on protected routes.

## 3. End-to-End Tests (Playwright)

### Scope
- **Critical Paths**: User Login, PGN Upload, Board Rendering, Engine Evaluation.

### Execution
- Ran on staging deployments before promoting to production.

### Edge Cases to Assert
- **WebWorker OOM**: Verify the browser does not crash when the WASM Engine is toggled on/off repeatedly 10 times.
- **WebSocket Drops**: Emulate a network disconnect during evaluation; verify the UI shows a "Reconnecting..." toast and recovers gracefully.

## 4. Performance & Security Tests (k6)

### Scope
- **API Throttling**: Verifying the Token Bucket correctly issues HTTP `429`.
- **WebSocket Max Connections**: Stress testing the NestJS Socket.io gateway.

### Execution
- Ran manually during major architecture changes, or scheduled weekly against Staging.

### Failure Cases to Assert
- **Queue Backup**: Simulate worker nodes going offline. Verify the API eventually starts returning HTTP `503 Service Unavailable` instead of accepting jobs into an infinite memory queue.
