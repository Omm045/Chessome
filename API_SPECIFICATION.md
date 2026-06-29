# Chessome: API Specification

## 1. Philosophy
The API must be stateless, versioned (`/v1`), and exhaustively documented using OpenAPI (Swagger). It follows strict RESTful conventions for standard operations and WebSockets for real-time analysis streaming.

## 2. API Boundaries

### 2.1 REST API (NestJS Controllers)
- **Content-Type**: `application/json`
- **Authentication**: Bearer Token (JWT).

#### Core Endpoints (Examples)
- `POST /v1/auth/login`
- `GET /v1/users/me`
- `POST /v1/games/sync` - Triggers a background job to sync from Lichess/Chess.com.
- `GET /v1/games/:id` - Fetches a game by ID (Returns JSON with PGN string).
- `POST /v1/analysis/cloud` - Submits a FEN for cloud analysis. Returns `202 Accepted` and a `jobId`.
- `GET /v1/explorer/master` - Query params: `?fen=...` Returns opening book statistics.

### 2.2 WebSocket API (Socket.io)
- **Namespace**: `/v1/analysis`
- **Authentication**: JWT passed in the handshake payload.

#### Events (Client -> Server)
- `subscribe_job`: `{ jobId: string }`
- `cancel_job`: `{ jobId: string }`

#### Events (Server -> Client)
- `evaluation_update`: 
  ```json
  {
    "jobId": "uuid",
    "fen": "rnbqkbnr/...",
    "depth": 22,
    "score": { "type": "cp", "value": 45 },
    "pv": ["e2e4", "e7e5"]
  }
  ```
- `job_completed`: `{ jobId: string, finalEvaluation: ... }`

## 3. Error Handling
All errors follow the RFC 7807 standard for Problem Details for HTTP APIs.

```json
{
  "type": "https://chessome.org/errors/rate-limit-exceeded",
  "title": "Rate Limit Exceeded",
  "status": 429,
  "detail": "You have exceeded your cloud analysis quota for the hour.",
  "instance": "/v1/analysis/cloud"
}
```

## 4. Architectural Decision Records (ADR)

### ADR-API-001: REST over GraphQL for the Core Platform
- **Why it exists**: GraphQL is excellent for frontend flexibility, but REST is vastly easier to cache at the CDN layer (Cloudflare) and simpler for third-party developers to integrate with via simple HTTP clients.
- **Trade-offs**: REST may suffer from over-fetching or under-fetching data.
- **Alternative approaches**: Exclusively GraphQL or gRPC.
- **Future scalability**: Next.js Server Components mitigate the need for GraphQL, as the server can fetch exactly what the component needs via internal service calls.
- **Risks**: Maintaining multiple API endpoints as the domain grows.
- **Engineering justification**: The primary external interface will be strict REST. This ensures maximum compatibility with community scripts, curl commands, and generic HTTP clients. If frontend data requirements become too complex, we will implement a Backend-For-Frontend (BFF) pattern within Next.js, aggregating REST calls, rather than adding the overhead of a GraphQL engine to the core API.

### ADR-API-002: Zod for Request/Response Validation
- **Why it exists**: TypeScript interfaces do not exist at runtime. If a user posts `{ "fen": 123 }`, the server must reject it safely.
- **Trade-offs**: Zod adds slight runtime parsing overhead.
- **Alternative approaches**: `class-validator` (NestJS default).
- **Future scalability**: Zod schemas can be shared directly with the frontend in `packages/core` to provide identical client-side and server-side validation.
- **Risks**: Schema drift if not maintained centrally.
- **Engineering justification**: We will replace NestJS's default `class-validator` with a custom Zod validation pipe. This allows us to define the `FENSchema` once in `packages/core`, use it in the React frontend form, and use it in the backend API controller, perfectly satisfying the DRY (Don't Repeat Yourself) principle.
