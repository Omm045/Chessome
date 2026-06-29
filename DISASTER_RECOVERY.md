# Chessome: Disaster Recovery

## 1. Objectives
- **Recovery Point Objective (RPO)**: The maximum acceptable data loss. Target: **5 Minutes** (User Profiles, Collections, OAuth ties). Note: Analyzed games are ephemeral and can be recalculated, so their RPO is less strict.
- **Recovery Time Objective (RTO)**: The maximum acceptable downtime. Target: **15 Minutes** for API, **1 Hour** for full Engine Cluster recovery.

## 2. Component Failure Strategies

### 2.1 Database Restore (PostgreSQL)
- **Backup Strategy**: Continuous WAL (Write-Ahead Logging) archiving to AWS S3 / Cloudflare R2 via `pgBackRest` or `wal-g`, plus daily full snapshots.
- **Restore Process**:
  1. Terraform provisions a new DB instance.
  2. `pgBackRest` pulls the latest snapshot and replays WAL logs up to the exact minute before the crash (Point-in-Time Recovery).
- **Redundancy**: Run a hot standby read-replica in a different availability zone. Failover is handled automatically by the connection pooler (PgBouncer/RDS).

### 2.2 Redis Failure
- **Impact**: If Redis crashes, all active background jobs (BullMQ queues), caching, and Pub/Sub WebSockets instantly fail.
- **Recovery**:
  - Redis data (specifically the BullMQ state) is persisted to disk using AOF (Append Only File) every second.
  - If the primary node dies, Redis Sentinel promotes a replica to primary within 5 seconds.
  - Connected WebSockets will drop, but the React frontend implements exponential backoff to reconnect seamlessly.
  - In a total catastrophic wipe (AOF destroyed), the API simply returns 503 for Cloud Analysis until a fresh Redis instance boots. Data loss is limited to "jobs currently in the queue."

### 2.3 Worker Crashes (OOM or Segfaults)
- **Impact**: Stockfish segfaults or consumes too much RAM, killing the worker pod.
- **Recovery**:
  - Handled natively by Kubernetes and BullMQ.
  - K8s restarts the pod instantly.
  - BullMQ's "Stalled Job Recovery" mechanism detects that the worker stopped pinging the job lease. After 30 seconds, BullMQ moves the job back to the `wait` queue, and a new worker picks it up. No data is lost, only delayed.

### 2.4 Complete Region Failure
- **Impact**: e.g., `us-east-1` goes down entirely.
- **Recovery**:
  - **Stateless Tier** (Web/API/Workers): Terraform applies configuration to a secondary region (`eu-central-1`). Docker images are pulled from the global GitHub Container Registry.
  - **Stateful Tier** (DB): Cross-region replication must be active, or we restore from the global S3 backup bucket.
  - **DNS**: Cloudflare automatically routes traffic to the surviving region via Anycast and Health Checks.

## 3. Deployment Rollback
If a bad deployment breaks the API (e.g., a buggy Zod schema rejects all FENs):
1. **Detection**: API HTTP 500 rate exceeds 5% in Prometheus.
2. **Action**: `kubectl rollout undo deployment/chessome-api`.
3. **Time to Recover**: < 30 seconds. (Kubernetes instantly spins down the new pods and spins up the previous Docker tag).
4. **Database Caveat**: If the bad deploy included a breaking database migration (e.g., dropping a column), rolling back code will not fix it. We use the "Expand and Contract" database migration pattern to ensure schema changes are always backwards compatible for at least one release cycle.
