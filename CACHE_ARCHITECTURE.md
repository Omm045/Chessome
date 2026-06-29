# Chessome: Cache Architecture

## 1. Overview
Evaluating a chess position at depth 20 takes several seconds of heavy CPU time. However, chess positions are finite. The Cache Architecture guarantees that the platform never wastes compute power evaluating a position that has already been analyzed to the same or higher depth.

## 2. Redis Key Strategy

### 2.1 The Global FEN Cache
- **Key Format**: `eval:{normalized_fen}`
  - *Normalization*: FENs must be normalized (removing move counters and half-move clocks, keeping only piece placement, active color, castling rights, and en passant targets) to ensure cache hits even if the position is reached via a different move order.
- **Data Structure**: Redis Hash (HSET).
- **Fields**:
  - `depth`: Integer (e.g., 20)
  - `payload`: JSON string (The `EngineEvaluation` object)

### 2.2 Redis Cache Lookup Logic
When the API receives an evaluation request for FEN `X` at target depth `D`:
1. Execute `HGETALL eval:X`
2. If `cacheHit` AND `cache.depth >= D`:
   - Return cached evaluation immediately.
3. If `cacheMiss` OR `cache.depth < D`:
   - Queue job for the Engine Worker.
   - When the worker finishes, it executes `HSET eval:X depth D payload JSON`.

### 2.3 Other Cache Namespaces
- `user:{id}:profile` -> Caches basic Lichess/Chess.com profile data.
- `game:{id}:pgn` -> Caches frequently accessed master games.
- `rate_limit:{ip}` -> Token bucket counters.

## 3. Eviction & TTL Policies
Memory in Redis is expensive. We must evict stale or low-value data.
- **Evaluation Cache (High Depth > 18)**: No TTL. These take significant compute to generate and are valuable forever (or until the engine is upgraded).
- **Evaluation Cache (Low Depth < 18)**: TTL = 7 Days. Low depth evaluations are fast to generate and not worth storing permanently.
- **Eviction Policy**: `volatile-lru` (Evict keys with a TTL set, using Least Recently Used algorithm). 

## 4. Depth Invalidation & Engine Upgrades
When Stockfish 17 is released, all Stockfish 16 evaluations become "stale" (technically correct, but possibly inferior).
- We append the engine version to the cache key: `eval:{engine_id}:{normalized_fen}` (e.g., `eval:sf16:rnbq...`).
- When swapping to `sf17`, the system naturally creates new cache entries.
- We run a background cleanup script to attach a 30-day TTL to all `sf16` keys, allowing them to age out gracefully without dropping the entire database at once.

## 5. Sharding Strategy
At 1 Million DAU, a single Redis node cannot hold the entire global FEN cache in memory (hundreds of gigabytes).
- **Solution**: Redis Cluster.
- Keys are automatically sharded across multiple nodes based on the `{normalized_fen}` hash slot.
- This allows horizontal scaling of the cache layer infinitely.
