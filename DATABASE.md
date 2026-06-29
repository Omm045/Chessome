# Chessome: Database Architecture

## 1. Core Technology
- **Primary Datastore**: **PostgreSQL** (Relational, ACID, robust JSONB support).
- **ORM**: **Prisma** (Provides type-safe database access and automated migrations).
- **Caching**: **Redis** (In-memory, Pub/Sub, fast FEN lookups).

## 2. Schema Design (High-Level)

### 2.1 Users & Auth
- `User`: ID, username, email, password_hash, OAuth providers, created_at.
- `Session`: Token, user_id, expires_at.

### 2.2 Games & Analysis
- `Game`: ID, user_id (owner), pgn (raw), white_player, black_player, result, date, source (chess.com/lichess/manual).
- `Position`: Hash (FEN), active_color, castling, en_passant.
- `Evaluation`: ID, position_hash, engine_id, depth, score_cp, score_mate, multipv, nodes, time, pv (JSON array of moves).

### 2.3 Training & Collections
- `Collection`: ID, user_id, name, is_public.
- `CollectionGame`: Linking table (Collection ID <-> Game ID).
- `Puzzle`: ID, source_game_id, starting_fen, solution_moves (JSON), theme.

## 3. Dealing with Massive Data (The Evaluation Table)
The `Evaluation` table will grow infinitely. Every analyzed move generates evaluations.
- **Deduplication**: We do not store an evaluation attached to a *Game*. We attach it to a *Position* (FEN). If two users analyze the starting position of the Sicilian Defense, it is evaluated and stored exactly once.
- **JSONB for Variations**: The Principal Variation (PV) string from the engine is stored as a JSONB array, allowing for flexible querying if needed, but mostly optimized for rapid retrieval.

## 4. Architectural Decision Records (ADR)

### ADR-DB-001: Storing PGNs vs Storing Move Trees in SQL
- **Why it exists**: PGNs (Portable Game Notation) can contain complex nested variations, comments, and annotations. Storing this natively in SQL requires a complex recursive table structure (Node -> Parent Node).
- **Trade-offs**: Parsing a PGN string on every read costs CPU. A recursive SQL tree is fast to query specific moves but incredibly slow and complex to insert.
- **Alternative approaches**: Graph Database (Neo4j) or NoSQL (MongoDB).
- **Future scalability**: PGN strings are universally understood and compact.
- **Risks**: Updating a single comment deep in a variation requires overwriting the entire PGN string in the database.
- **Engineering justification**: The `Game` table will store the raw `PGN` string as `TEXT`. The backend/frontend parses the PGN into a memory tree when the game is loaded. The relational database is NOT used to traverse move trees. However, for the **Master Games** and **Opening Explorer**, we will maintain a separate highly-indexed table (`OpeningMove`) that maps `(FEN, Move)` to a statistical count (Wins, Draws, Losses) for rapid opening book generation.

### ADR-DB-002: Prisma ORM limitations with bulk inserts
- **Why it exists**: Prisma is notorious for being slow with massive bulk inserts (e.g., importing a 10,000 game PGN file) because it doesn't utilize raw `COPY` commands efficiently.
- **Trade-offs**: Dropping down to raw SQL loses type safety.
- **Alternative approaches**: TypeORM, Drizzle, or raw pg-promise.
- **Future scalability**: Drizzle ORM is faster, but Prisma's schema management is superior for open-source contributions.
- **Risks**: API timeouts during bulk imports.
- **Engineering justification**: We will use Prisma for 95% of queries to guarantee type safety and developer velocity. For the 5% of hyper-performance critical paths (e.g., bulk importing grandmaster databases, bulk inserting engine evaluations from workers), we will use Prisma's `$executeRaw` to write optimized Postgres `INSERT ... ON CONFLICT DO NOTHING` statements, bypassing the Prisma query engine overhead.
