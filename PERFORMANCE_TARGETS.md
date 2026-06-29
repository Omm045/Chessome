# Chessome: Performance Targets

## 1. Philosophy
Chessome must feel instantaneously responsive. A sluggish UI during chess analysis destroys focus and frustrates users. Performance is treated as a feature and strictly monitored.

## 2. Frontend Performance (Web Vitals)
These targets apply to the initial load of the application (e.g., sharing a game link to Twitter).

| Metric | Target | Hard Limit | Monitoring Tool |
| :--- | :--- | :--- | :--- |
| **First Contentful Paint (FCP)** | < 1.0s | 1.8s | Lighthouse / Vercel Analytics |
| **Largest Contentful Paint (LCP)** | < 1.5s | 2.5s | Lighthouse / Vercel Analytics |
| **Cumulative Layout Shift (CLS)** | 0.00 | 0.1 | Lighthouse / Vercel Analytics |
| **Time to Interactive (TTI)** | < 2.0s | 3.5s | Lighthouse |
| **JavaScript Bundle Size (Core)** | < 200KB (gzip) | 350KB (gzip) | `@next/bundle-analyzer` |

## 3. Application Responsiveness
These targets apply to the interactive elements of the chessboard.

| Metric | Target | Hard Limit | Engineering Context |
| :--- | :--- | :--- | :--- |
| **Piece Drag FPS** | 60 FPS | 30 FPS | Rendered via CSS Transforms / Canvas |
| **Engine Eval UI Update** | < 16ms | 30ms | Mutates DOM directly, bypassing React state |
| **Move Tree Navigation** | < 10ms | 50ms | Key press to board update |

## 4. Backend API Performance
Measured at the 95th percentile (p95) under normal load.

| Metric | Target | Hard Limit | Notes |
| :--- | :--- | :--- | :--- |
| **Cached API Route (e.g., Master DB)** | < 50ms | 100ms | Served directly from Redis |
| **Standard API Route (e.g., Fetch User)** | < 150ms | 300ms | PostgreSQL Query |
| **Complex Route (e.g., Parse PGN upload)**| < 300ms | 1000ms | Heavy Node.js CPU processing |
| **WebSocket Broadcast Latency** | < 100ms | 250ms | Worker -> Redis PubSub -> Gateway -> Client |

## 5. Worker & Analysis Throughput
For the cloud background analysis nodes.

| Metric | Target | Hard Limit | Notes |
| :--- | :--- | :--- | :--- |
| **WASM Local Eval (Mobile)** | > 500k NPS | > 100k NPS | Nodes Per Second (NNUE) |
| **WASM Local Eval (Desktop)**| > 2M NPS | > 500k NPS | Nodes Per Second (NNUE + Threads) |
| **Cloud Worker Eval** | > 5M NPS | > 2M NPS | Nodes Per Second (Native AVX2) |
| **Game Review Processing Time** | < 20s | 60s | 40-move game at depth 18 |

## 6. Scale Targets (v1.0 Architecture)
The architecture must be capable of supporting the following without fundamental rewrites:
- **Concurrent WebSockets**: 50,000
- **Daily Active Users**: 100,000
- **Database Size**: 1 Billion Evaluation rows (Partitioned PostgreSQL)
- **Redis Queue Throughput**: 1,000 jobs processed per second

## 7. Actionable Enforcement
- If a pull request increases the main JavaScript bundle size by more than 5%, the CI pipeline will **FAIL**.
- If a backend API route's p95 latency creeps above 300ms in Staging, the deployment to Production is **HALTED**.
