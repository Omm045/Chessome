# Chessome Deployment Architecture

This document defines the official deployment architecture and operational strategy for the Chessome platform, moving from local development into production.

## 1. High-Level Architecture

Chessome is a distributed system relying on managed edge infrastructure for the frontend, persistent scalable compute for the backend, and managed cloud services for persistence and authentication.

```mermaid
graph TD
    User([User / Browser]) --> Vercel[Frontend: Next.js on Vercel]
    User --> API[Backend: NestJS API]
    
    Vercel --> API
    
    subgraph Persistent Node Runtime
        API --> Coordinator[Analysis Coordinator]
        Coordinator --> Engine[Stockfish Binary Processes]
    end
    
    API --> SupabaseAuth[Supabase Auth]
    API --> SupabaseDB[(Supabase PostgreSQL)]
    API --> UpstashRedis[(Upstash Redis)]
```

## 2. Infrastructure Targets

### 2.1 Frontend (Next.js)
- **Host**: Vercel
- **Strategy**: Edge delivery, server-side rendering (SSR), and static site generation (SSG).
- **Rationale**: Vercel provides world-class global edge routing, seamless Next.js optimization, and zero-config deployment.

### 2.2 Backend (NestJS + Engines)
- **Host**: Fly.io (Free Tier)
- **Strategy**: Long-lived Node.js processes wrapping native C++ Stockfish binaries.
- **Rationale**: **Do NOT deploy the backend to Vercel Serverless.** Serverless environments aggressively kill processes and heavily restrict execution time. Chess analysis requires persistent WebSocket/SSE connections and heavy, long-running CPU calculations via native binaries. Fly.io provides persistent container runtimes ideally suited for long-lived processes.

### 2.3 Database (PostgreSQL)
- **Host**: Supabase
- **Strategy**: Managed PostgreSQL with connection pooling (PgBouncer/Supavisor).
- **Rationale**: Supabase provides robust managed Postgres, integrated authentication, and seamless scaling.

### 2.4 Authentication (Supabase Auth)
- **Host**: Supabase
- **Strategy**: JWT-based authentication managed entirely by Supabase.
- **Integration**: The backend interfaces with Supabase Auth via a strict adapter layer. The domain remains agnostic to the provider.

### 2.5 Caching & Queueing (Redis)
- **Host**: Upstash
- **Strategy**: Serverless Redis for lightweight rate limiting, ephemeral session caching, and background job queues (BullMQ).
- **Rationale**: Upstash is cost-effective, scales instantly to zero, and integrates flawlessly via REST/TCP.

## 3. Environment Variables

Both local development and production require strict secrets management.

### Shared Environment (`.env`)
```env
# Database
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"

# Redis
REDIS_URL="rediss://default:[PASSWORD]@[ENDPOINT].upstash.io:6379"

# Supabase Auth
SUPABASE_URL="https://[PROJECT_REF].supabase.co"
SUPABASE_SERVICE_ROLE_KEY="eyJhb..."

# App Configuration
NODE_ENV="production"
PORT=4000
FRONTEND_URL="https://chessome.com"
```

## 4. Scaling Strategy

- **API & Analysis Scaling**: The NestJS backend can scale horizontally. However, because Stockfish processes are highly CPU-intensive, horizontal scaling must be mapped to CPU resources. A load balancer (e.g., Nginx, Fly Proxy) routes SSE traffic to available instances.
- **Database Scaling**: Supabase read-replicas handle heavy read loads. Connection pooling is strictly enforced for Serverless edge functions hitting the DB.
- **Engine Layer Isolation**: Future iterations may separate the NestJS REST API from the `EngineExecutor` workers entirely using Redis queues (BullMQ), allowing engine workers to scale independently on bare-metal compute.

## 5. Backup & Security
- **Backups**: Supabase provides automated daily backups and Point-in-Time Recovery (PITR) for the PostgreSQL database.
- **Secrets Management**: No secrets are committed to the repository. In production, Vercel Environment Variables and Fly.io Secrets inject environment configuration securely.
- **DDoS Protection**: Vercel's edge network automatically mitigates L3/L4/L7 attacks against the frontend. The backend must be shielded behind a WAF or strict rate-limiting (via Upstash Redis).
