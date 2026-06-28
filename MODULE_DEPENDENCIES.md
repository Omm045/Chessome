# Chessome: Module Dependency Graph

To prevent "Spaghetti Code", Chessome enforces strict module boundaries using `@nx/enforce-module-boundaries` in ESLint.

## 1. The Dependency Graph

```text
apps/web (Next.js)
  │
  ├──> packages/ui (React Components)
  ├──> packages/core (Zod Schemas, Domain Logic)
  └──> external (Zustand, React Query, etc)

apps/api (NestJS)
  │
  ├──> packages/database (Prisma Client)
  ├──> packages/core (Zod Schemas, Interfaces)
  ├──> packages/engine-adapters (Cloud Process, Network)
  └──> external (NestJS Core, BullMQ)

apps/worker-analysis (Node.js)
  │
  ├──> packages/database (Raw SQL queries for bulk inserts)
  ├──> packages/core (Schemas)
  ├──> packages/engine-adapters (Stockfish Binary Runner)
  └──> external (BullMQ, Redis)

packages/database
  │
  ├──> packages/core (To type JSONB columns)
  └──> external (Prisma)

packages/engine-adapters
  │
  ├──> packages/core (To implement IEngineAdapter)
  └──> external (None)

packages/core
  │
  └──> external (Zod, chess.js)
```

## 2. Forbidden Imports (Enforced by ESLint)

1. **`packages/core` MUST NOT import `packages/database`**.
   - *Why*: The Domain layer must remain completely agnostic of how data is stored.
2. **`packages/core` MUST NOT import anything from `apps/*`**.
   - *Why*: Packages are foundational. Apps are consumers.
3. **`apps/web` MUST NOT import `packages/database`**.
   - *Why*: Next.js Server Components *can* technically hit the DB directly, but to maintain a decoupled architecture (allowing mobile apps later), all DB access must go through `apps/api` via HTTP/REST.
4. **`packages/ui` MUST NOT import `packages/core`**.
   - *Why*: UI components must be completely "dumb". A `Button` or `EvaluationBar` should not know what an `EngineEvaluation` object is. It should only take primitive props (`score: number`, `mate: boolean`).

## 3. Dependency Inversion Rules
When `apps/api` needs to evaluate a position, it must NOT instantiate a specific engine class directly.

**❌ Wrong:**
```typescript
import { StockfishAdapter } from '@chessome/engine-adapters';
const engine = new StockfishAdapter();
```

**✅ Right:**
```typescript
import { IEngineAdapter } from '@chessome/core';
import { Inject } from '@nestjs/common';

constructor(@Inject('ENGINE_ADAPTER') private readonly engine: IEngineAdapter) {}
```
*The actual `StockfishAdapter` is provided by the NestJS Dependency Injection container at runtime, allowing it to be easily mocked during testing.*
