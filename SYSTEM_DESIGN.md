# Chessome: System Design

## 1. System Overview

To support millions of users seamlessly, Chessome utilizes a distributed, event-driven architecture. Compute-heavy operations (Chess Engine Analysis) are entirely decoupled from the API layer to prevent blocking the web servers.

## 2. High-Level Components

1. **Edge/CDN (Cloudflare/AWS CloudFront)**: Caches static assets, handles SSL termination, and provides DDoS protection.
2. **Web Tier (Next.js)**: Serves the frontend application. Server Components handle initial HTML rendering.
3. **API Gateway & Services (NestJS)**: Stateless REST/GraphQL servers. Handles authentication, routing, and database reads/writes.
4. **WebSocket Fleet**: Dedicated lightweight Node.js/Go servers for pushing live evaluation updates and real-time multiplayer state to clients.
5. **Message Broker (Redis/RabbitMQ)**: Manages queues for background tasks (Game Sync, Cloud Analysis, Export).
6. **Worker Tier (Node.js/Native)**: Scalable fleet of workers executing UCI engines.
7. **Database Tier (PostgreSQL)**: Primary persistence store.

## 3. Data Flow: Cloud Analysis Request

1. Client submits a FEN for cloud analysis via HTTP POST to the API.
2. API validates the request, checks rate limits, and inserts an `AnalysisJob` into the database with state `PENDING`.
3. API pushes a message to the Redis queue (`analysis-queue`).
4. API responds to the Client with `HTTP 202 Accepted` and a `jobId`.
5. Client connects via WebSocket subscribing to `job:{jobId}`.
6. A Worker picks up the job from Redis.
7. Worker spawns the engine binary (e.g., Stockfish) as a child process.
8. As the engine streams evaluation lines (MultiPV), the Worker publishes updates to a Redis Pub/Sub channel.
9. WebSocket servers relay the Pub/Sub messages to the connected Client.
10. Upon completion, Worker writes the final evaluation to PostgreSQL and updates the job state to `COMPLETED`.

## 4. Scalability & Performance

### 4.1 Caching Strategy
- **Evaluation Cache**: Chess positions are finite (though massive). Before queuing an engine analysis, the system queries a high-speed Redis cache using the FEN as the key. If a depth-20 evaluation already exists for this FEN, it returns instantly (O(1)).
- **Database Caching**: Master games and opening trees are heavily cached as they rarely change.

### 4.2 Horizontal Scaling
- **Stateless API**: API instances store no local session data (using JWTs and Redis sessions) and can auto-scale based on CPU utilization.
- **Worker Pools**: The worker fleet scales based on queue depth. During high load (e.g., World Chess Championship live analysis), the system can spin up hundreds of preemptible/spot instances to crunch engine lines.

### 4.3 Database Optimization
- **Read Replicas**: Heavy read operations (like searching the Master Games database) are routed to PostgreSQL Read Replicas.
- **Partitioning**: The `Moves` and `Evaluations` tables will grow exponentially. They are partitioned by date and game ID.

## 5. Architectural Decision Records (ADR)

### ADR-SYS-001: Local (Browser) vs Cloud Analysis
- **Why it exists**: Cloud compute is expensive. Offering unlimited deep analysis for free is financially impossible without optimization.
- **Trade-offs**: Local analysis relies on the user's hardware (battery drain, slower on mobile) but costs us nothing. Cloud analysis is fast but costs money.
- **Alternative approaches**: Cloud-only (too expensive for free tier), Local-only (poor experience on low-end devices).
- **Future scalability**: WASM implementations of Stockfish are approaching near-native speeds.
- **Risks**: WebAssembly memory limits might restrict hash tables for deep analysis locally.
- **Engineering justification**: By default, Chessome performs **Local Analysis via WASM** for all non-authenticated or free-tier users, utilizing Web Workers. Cloud Analysis is reserved for specific deep-dive requests, premium users (if implemented), or background game reviews, drastically reducing server costs while maintaining the "Free & Open" vision.

### ADR-SYS-002: Real-time Streaming via Redis Pub/Sub
- **Why it exists**: Users expect to see engine lines evaluating in real-time, just like a local GUI.
- **Trade-offs**: Managing persistent WebSocket connections requires careful load balancing (sticky sessions or Pub/Sub backplanes).
- **Alternative approaches**: HTTP Long Polling, Server-Sent Events (SSE).
- **Future scalability**: Redis Pub/Sub allows any WebSocket server to receive updates from any Worker, meaning the API and Worker layers can scale independently without needing to know which server the client is connected to.
- **Risks**: High volume of Pub/Sub messages can choke Redis if not batched.
- **Engineering justification**: Workers will throttle evaluation updates (e.g., max 4 updates per second per job) to prevent overwhelming the Pub/Sub bus and the client UI, while still feeling instantaneous to the human eye.
