# Chessome: Developer Environment

## 1. Philosophy
The "Time to First Run" for a new open-source contributor must be under 5 minutes. No complex global dependencies, no manual database installations. The developer environment must mirror production as closely as possible.

## 2. Prerequisites
- Docker & Docker Compose
- Node.js (v20+)
- pnpm (v8+)

## 3. The `docker-compose.dev.yml`
The core of the dev experience is Docker. Running `docker-compose -f docker-compose.dev.yml up -d` will spin up:
- PostgreSQL (Port 5432)
- Redis (Port 6379)
- Localstack (if S3/Cloud services are needed later)

*Note: The Next.js and NestJS apps are NOT run in Docker during development. They are run on the host machine to leverage hot-module replacement (HMR).*

## 4. Monorepo Scripts
Using Turborepo, a developer simply runs:
- `pnpm install`
- `pnpm run db:setup` (Runs Prisma migrations and seeds standard chess openings)
- `pnpm run dev` (Starts Next.js on port 3000, NestJS API on 4000, and the local worker on 5000 in parallel).

## 5. Architectural Decision Records (ADR)

### ADR-DEV-001: Strict Linting and Formatting as Pre-Commit Hooks
- **Why it exists**: In an open-source project, contributors use different IDEs (VSCode, WebStorm, Vim). Tab/Space wars and missing semicolons cause massive merge conflict headaches.
- **Trade-offs**: Pre-commit hooks can slow down the git workflow.
- **Alternative approaches**: Only failing on CI.
- **Future scalability**: Ensures a unified codebase aesthetic regardless of author.
- **Risks**: Frustrating new contributors who aren't used to strict rules.
- **Engineering justification**: We use `Husky` and `lint-staged`. Before a commit is allowed, `Prettier` formats the changed files, and `ESLint` ensures there are zero warnings. If a rule is violated (e.g., `no-explicit-any`), the commit fails locally, preventing the CI pipeline from wasting compute time.

### ADR-DEV-002: Seed Data for Local Development
- **Why it exists**: An empty chess database is useless for testing the Analysis UI. A developer needs real games and evaluations to build frontend components.
- **Trade-offs**: Maintaining seed scripts takes effort.
- **Alternative approaches**: Asking developers to manually play games to generate data.
- **Future scalability**: Allows designers to test complex UI states (e.g., "Game with 10 blunders") immediately.
- **Risks**: Seed data becoming outdated with schema changes.
- **Engineering justification**: The `db:setup` script will insert a deterministic set of data: 2 User accounts, 5 PGN games (ranging from 10 moves to 100 moves), and pre-calculated engine evaluations for one of those games. This guarantees every developer starts from the exact same state.
