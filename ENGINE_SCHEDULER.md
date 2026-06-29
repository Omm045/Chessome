# Chessome: Engine Scheduler Architecture

## 1. The Problem
When 500 users simultaneously request a full Game Review, they queue 500 * 40 = 20,000 engine evaluation jobs. If a simple FIFO (First-In, First-Out) queue is used, User 500 must wait for the first 499 games to finish before seeing their first move evaluated. This is unacceptable UX. Furthermore, Stockfish processes are highly CPU and memory intensive; assigning too many engines to a single worker node will cause CPU thrashing and Out-Of-Memory (OOM) crashes.

## 2. The Scheduler Architecture

The Scheduler sits between the API Gateway and the Engine Workers. It manages routing, prioritization, and hardware limits.

### 2.1 Job Priority Queues
We use **BullMQ** with strict prioritization rather than FIFO.
- **Priority 1 (Interactive)**: A user currently looking at a live board, requesting a single FEN evaluation. (Must start within 100ms).
- **Priority 2 (Game Review - Active)**: A user waiting on the Game Review loading screen.
- **Priority 3 (Game Review - Background)**: A user requested a review but navigated away.
- **Priority 4 (Batch/System)**: Re-evaluating historical master games for database seeding.

### 2.2 Fair Round-Robin (User Fairness)
To solve the "User 500" problem, the Scheduler implements a **User-Fairness Round-Robin**. 
If User A queues 40 moves, and User B queues 40 moves, the scheduler pops `User A - Move 1`, then `User B - Move 1`, then `User A - Move 2`. This guarantees that *every* active user sees their Game Review bar start to fill up immediately, rather than waiting for other users' entire games to finish.

### 2.3 Hardware Resource Management
Worker nodes periodically report their telemetry (CPU usage, free RAM, running engine count) to Redis.
- **Engine Pre-allocation**: A cloud worker node with 16 vCPUs can safely run 4 Stockfish instances using 4 threads each.
- **Worker Assignment**: The Scheduler acts as a Load Balancer. It checks Redis for an available "Engine Slot" on a worker. If Worker-1 has 4/4 slots full, the job goes to Worker-2. 
- **Auto-scaling**: If all slots across the entire cluster are > 90% utilized for more than 10 seconds, the Scheduler emits a `ScaleOutRequired` event to Kubernetes (KEDA), which spins up new worker pods.

## 3. Worker Node Lifecycle
1. Worker Pod boots.
2. Worker registers itself in Redis: `SET worker:123:capacity 4`.
3. Worker listens to the `job-routing-queue` specific to its ID.
4. When a job arrives, it claims 1 slot, spawns Stockfish, and analyzes.
5. Upon completion, it frees the slot and takes the next job.
6. If the worker crashes, BullMQ's active job timeout (Stalled Job Recovery) pushes the orphaned job back to the main queue for reassignment.

## 4. Architectural Decision Records (ADR)

### ADR-SCHED-001: Abstracting Engine Types in the Queue
- **Context**: A user requests an evaluation from "Leela Chess Zero (Lc0)" which requires a GPU, but 95% of our worker nodes are CPU-only Stockfish instances.
- **Decision**: Jobs contain an `engineRequirements` tag. Worker nodes register with `capabilities` (e.g., `['avx2', 'cuda']`).
- **Alternatives considered**: Separate queues for every engine (leads to queue fragmentation and idle workers).
- **Consequences**: The Scheduler must perform capability matching before assigning a worker. CPU jobs cannot block GPU workers, and GPU jobs must wait for GPU workers.
- **Future impact**: Easily supports adding highly specialized engines (e.g., Quantum chess evaluators) without breaking the core queue.
