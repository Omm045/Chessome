# Backend Architecture Freeze Contract

**Freeze Date:** June 29, 2026  
**Tag:** `v0.3.0-backend-freeze`  
**Architecture Version:** 0.3.0  

## Packages Frozen
The following core and backend packages are officially frozen. Their internal structure and purpose must not be fundamentally altered:
- `@chessome/core`
- `@chessome/application`
- `@chessome/chess`
- `@chessome/engine`
- `@chessome/engine-stockfish`
- `@chessome/fen`
- `@chessome/pgn`
- `@chessome/database`
- `@chessome/cache`
- `@chessome/messaging`
- `@chessome/queue`
- `@chessome/storage`
- `@chessome/ports`
- `@chessome/events`
- `@chessome/types`
- `@chessome/validation`
- `@chessome/shared`
- `@chessome/testing`

## Public APIs Frozen
All public interfaces exported from the `index.ts` of the packages listed above are considered **frozen**. Breaking changes to these interfaces (e.g., removing methods, changing parameter types) are forbidden without an ADR.

---

## Allowed Changes During Phase 3
Phase 3 focuses on frontend, integrations, and product development. The following activities are allowed and encouraged:
- Creating REST/GraphQL endpoints and API controllers.
- OAuth setup and user authentication.
- External integrations (Chess.com, Lichess).
- Building Next.js pages, React components, UI, and UX.
- Mapping backend Domain objects to DTOs for the API layer.
- Implementing WebSockets/SSE for real-time engine evaluation streaming.
- Database schema additions/migrations (when required by new product features).
- Bug fixes in the frozen packages (must not break the public API).

## Forbidden Changes During Phase 3 (Unless Absolutely Necessary)
- Introducing new workspace packages.
- Adding new architectural layers (e.g., trying to add another domain layer or replacing Hexagonal Architecture).
- Rewriting the core domain, engine runtime, or application use-case layers.
- Breaking public APIs of frozen packages.
- Changing package boundaries (e.g., moving `events` logic into `core`).
- Changing DDD boundaries or aggregate definitions.
- Introducing new infrastructure abstractions (e.g., swapping Redis for RabbitMQ).

---

## Procedure for Future Architecture Decision Records (ADRs)
If a product requirement in Phase 3 or beyond genuinely cannot be met under the current architecture, a formal ADR is required.

1. **Draft an ADR**: Create a new file in `docs/adr/` (e.g., `001-replace-redis-with-valkey.md`).
2. **Context & Problem**: Clearly state why the current architecture fails to support the product requirement.
3. **Proposed Change**: Detail the exact change, which packages it affects, and how the public APIs will shift.
4. **Consequences**: List the pros, cons, and required refactoring effort.
5. **Approval**: The ADR must be reviewed and merged before any code is written.

---

## Compatibility Promise
The backend follows Semantic Versioning. During Phase 3:
- Existing public APIs may be extended.
- Existing public APIs will not be broken.
- Deprecated APIs must remain available for at least one release cycle.
- Breaking API changes require:
  - an ADR
  - migration notes
  - version bump
