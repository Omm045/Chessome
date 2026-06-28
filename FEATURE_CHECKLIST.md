# Chessome: Feature Checklist (Definition of Done)

This document defines the absolute **Definition of Done (DoD)** for any micro-task or feature PR in Chessome. A PR cannot be merged into `develop` unless every applicable box is checked.

## Code Quality
- [ ] Implementation perfectly matches the Zod data contracts in `packages/core`.
- [ ] No `any` types are used anywhere in the PR (except in highly constrained generic utility functions).
- [ ] No type assertions (`as unknown as Type`) are used for external API payloads or DB reads. Zod `.parse()` is used instead.
- [ ] ESLint passes with zero warnings.
- [ ] TypeScript compiles (`tsc --noEmit`) with zero errors.
- [ ] No `console.log` statements remain (use the `Pino` logger instead).
- [ ] No duplicated business logic (extracted to `packages/core` if used in multiple places).

## Testing
- [ ] Unit tests written for all new pure functions and reducers.
- [ ] Integration tests written using Testcontainers (if touching the database or Redis).
- [ ] Code coverage for the changed files is > 85%.
- [ ] Edge cases (e.g., null values, network timeouts, invalid FENs) are explicitly tested.
- [ ] If a bug was fixed, a regression test was added to prove the bug is gone.

## Performance
- [ ] The PR does not introduce unnecessary React re-renders (verified via React Profiler).
- [ ] High-frequency data (Engine Eval) does not trigger React state updates (uses DOM refs).
- [ ] Database queries are properly indexed. (No full table scans added).
- [ ] N+1 query problems avoided (Prisma `include` or Dataloader used).
- [ ] `next build` bundle size increases by less than 20KB. (If more, requires specific approval).

## Security
- [ ] All user inputs (PGN strings, OAuth tokens) are sanitized.
- [ ] No sensitive environment variables (API Keys) are exposed to the browser (Next.js `NEXT_PUBLIC_` prefix audited).
- [ ] Rate limits are applied to any new API endpoint.
- [ ] SQL Injection is impossible (Prisma handles this natively, but raw queries must be strictly parameterized).

## UX and Accessibility (a11y)
- [ ] Component is fully usable via Keyboard (`Tab`, `Enter`, `Arrows`).
- [ ] Visual focus rings are clearly visible.
- [ ] Screen reader `aria-labels` or `aria-live` regions are present for dynamic content updates.
- [ ] Color contrast meets WCAG 2.2 AA standards.
- [ ] Respects `prefers-reduced-motion` if introducing animations.

## Documentation
- [ ] Function parameters and complex logic blocks have JSDoc/TSDoc comments explaining *WHY* (not what).
- [ ] If this PR alters a core flow (e.g., changing the Redis Cache strategy), the corresponding Markdown files in the root architecture directory (e.g., `CACHE_ARCHITECTURE.md`) have been updated.
- [ ] OpenAPI (Swagger) decorators added to any new NestJS Controller endpoints.
