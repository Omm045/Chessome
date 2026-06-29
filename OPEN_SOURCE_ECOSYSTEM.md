# Chessome: Open Source Ecosystem Integration

## 1. Philosophy
Do not reinvent the wheel. If a mature, battle-tested open-source project exists, we integrate it via an adapter. We only build custom solutions for core competitive advantages (e.g., the analysis pipeline orchestrator, the UI/UX).

## 2. Core Dependencies

### 2.1 chess.js
- **Repository**: [jhlywa/chess.js](https://github.com/jhlywa/chess.js)
- **License**: BSD-2-Clause
- **Maintenance Status**: Highly active, widely adopted.
- **Community Adoption**: Industry standard for JS chess move validation. Used by Lichess and Chess.com (in various forks).
- **Advantages**: Handles complex FEN/PGN parsing, move generation, and checkmate detection flawlessly.
- **Limitations**: Written in JavaScript/TypeScript; not as fast as a native Rust parser for massive bulk processing.
- **Integration Strategy**: Wrapped in our `packages/core` via `IChessRulesEngine`. 
- **Replacement Strategy**: If we outgrow its performance, we replace the `IChessRulesEngine` implementation with a WASM/Rust library (e.g., Shakmaty) without changing our API layer.
- **Long-term Risks**: Low.

### 2.2 Stockfish.wasm
- **Repository**: [hi-ogawa/Stockfish](https://github.com/hi-ogawa/Stockfish) or official Stockfish ports.
- **License**: GPLv3
- **Maintenance Status**: Active, mirrors the main Stockfish C++ repository.
- **Community Adoption**: Standard for running NNUE locally in the browser.
- **Advantages**: Brings GM-level engine evaluation directly to the user's browser for free.
- **Limitations**: Memory bound (NNUE eval files can crash mobile Safari), lacks multi-threading on older browsers.
- **Integration Strategy**: Handled entirely inside `LocalWasmAdapter.ts`. Uses Web Workers.
- **Replacement Strategy**: N/A, Stockfish is the gold standard. We will continually update the WASM binary.
- **Long-term Risks**: Browser security policies restricting SharedArrayBuffer (required for WASM threads). Addressed via strict COOP/COEP headers.

### 2.3 NextAuth.js (Auth.js)
- **Repository**: [nextauthjs/next-auth](https://github.com/nextauthjs/next-auth)
- **License**: ISC
- **Maintenance Status**: Highly active, backed by Vercel.
- **Community Adoption**: The de facto standard for Next.js authentication.
- **Advantages**: Native support for OAuth (can easily hook into Lichess API), handles secure HttpOnly cookies and CSRF natively.
- **Limitations**: Highly opinionated about database schema if using their adapters.
- **Integration Strategy**: We use NextAuth strictly for the OAuth handshake and JWT generation, passing the JWT to our NestJS backend for session validation.
- **Replacement Strategy**: Manually implementing OAuth 2.0 PKCE flow.
- **Long-term Risks**: Breaking changes in major versions.

### 2.4 BullMQ
- **Repository**: [taskforcesh/bullmq](https://github.com/taskforcesh/bullmq)
- **License**: MIT
- **Maintenance Status**: Highly active.
- **Community Adoption**: Leading Redis-based queue for Node.js.
- **Advantages**: Supports job priorities, rate limiting, and parent-child flows (perfect for analyzing a game where "Game" is the parent job, and 40 "Moves" are child jobs).
- **Limitations**: Requires Redis.
- **Integration Strategy**: Used in `apps/worker-analysis` for polling the Redis queue.
- **Replacement Strategy**: Apache Kafka or RabbitMQ, abstracted behind an `IMessageQueue` interface.
- **Long-term Risks**: Low, though enterprise features are paid. We rely only on the open-source core.

### 2.5 Zustand
- **Repository**: [pmndrs/zustand](https://github.com/pmndrs/zustand)
- **License**: MIT
- **Maintenance Status**: Active.
- **Community Adoption**: Rapidly replacing Redux for complex React apps.
- **Advantages**: Tiny API, allows reading/writing state *outside* of React components (critical for WebSocket and WebWorker listeners handling engine evaluations).
- **Limitations**: Lacks the massive middleware ecosystem of Redux.
- **Integration Strategy**: Used exclusively in `apps/web` for client-side transient state (Board position, arrows, current eval).
- **Replacement Strategy**: Redux Toolkit or Jotai.
- **Long-term Risks**: Low.

## 3. Avoided Dependencies (Vendor Lock-in)

- **Firebase / Supabase**: While excellent tools, relying on their proprietary auth/database SDKs violates our core Open Source/Self-hosting philosophy. We use raw PostgreSQL instead.
- **Vercel KV / Upstash**: We use standard Redis. Users self-hosting can spin up `redis:alpine` instead of paying for a SaaS key-value store.
