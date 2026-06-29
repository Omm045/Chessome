# Chessome Remediation Plan (Post-RC Audit)

## Executive Summary

The initial infrastructure and API pruning remediations have been applied. However, those changes introduced severe regressions that broke the CI pipeline and build caching mechanisms. This updated remediation plan addresses the immediate blockers preventing Phase 3 from starting.

---

## P0: Critical Build Failures

### Finding 1: Corrupted Build Cache (`.tsbuildinfo` in Git)
* **Status**: Confirmed
* **Evidence**: `.tsbuildinfo` files are committed to the repository (e.g., in `packages/validation/`, `packages/shared/`) and are missing from the root `.gitignore`.
* **Impact**: When `tsc` runs on a fresh clone, it sees the committed `.tsbuildinfo` cache and falsely assumes the build is up to date, skipping the emission of `.js` and `.d.ts` files to `dist/`. This breaks all downstream packages with "Cannot find module" errors.
* **Recommended remediation**: Run `find . -name "*.tsbuildinfo" -type f -delete`, commit the deletions, and add `*.tsbuildinfo` to the root `.gitignore`.

---

## P1: CI and Test Failures

### Finding 2: Missing Prisma Generation in CI/Setup
* **Status**: Confirmed
* **Evidence**: `@chessome/database` fails to typecheck because `@prisma/client` is not generated. The `.npmrc` file enforces `ignore-scripts=true`, which prevents Prisma's `postinstall` script from running automatically upon `pnpm install`.
* **Impact**: Developers and CI pipelines cannot build the repository without manual intervention (`pnpm run db:generate`).
* **Recommended remediation**: Add a dedicated `pnpm run db:generate` step in `.github/workflows/ci.yml` (after install, before build) and document the requirement in `README.md`.

### Finding 3: Unmocked Binary in Application Tests
* **Status**: Confirmed
* **Evidence**: `@chessome/application:test` fails with `ENOENT` trying to spawn `packages/engine/bin/stockfish_exec`. The `bin` directory is correctly gitignored, but the test suite relies on it being present.
* **Impact**: The test suite fails out of the box.
* **Recommended remediation**: Refactor `PlatformIntegration.test.ts` to mock the engine binary for integration tests, or provide a `pretest` script that downloads the required Stockfish binary.

### Finding 4: Circular Dependencies in Engine
* **Status**: Confirmed
* **Evidence**: `npx depcruise` detects two new circular dependencies introduced during the recent API pruning:
  1. `packages/engine/src/transports/index.ts` ↔ `NodeProcessTransport.ts`
  2. `packages/engine/src/processes/EngineProcess.ts` ↔ `processes/index.ts`
* **Impact**: Fails the architectural boundary gates in CI. Circular dependencies complicate module resolution and tree-shaking.
* **Recommended remediation**: Refactor the imports in `NodeProcessTransport.ts` and `EngineProcess.ts` to import from sibling files directly rather than through the `index.ts` barrel file.

---

## P3: Missing Open-Source Fundamentals

### Finding 5: Missing LICENSE
* **Status**: Confirmed
* **Evidence**: The repository still lacks a `LICENSE` file.
* **Impact**: Undefined legal usage rights.
* **Recommended remediation**: Add a standard `LICENSE` file (e.g., MIT or Apache 2.0).

---

## IMPLEMENTATION ORDER

1. **Step 1: Fix Build Cache (Finding 1)** - Must be done first so `tsc` can emit files properly.
2. **Step 2: Fix Prisma Generation (Finding 2)** - Required for `@chessome/database` to compile.
3. **Step 3: Break Circular Dependencies (Finding 4)** - Restores a clean architectural graph.
4. **Step 4: Mock Test Binary (Finding 3)** - Ensures the test suite passes natively.
5. **Step 5: Add LICENSE (Finding 5)** - Final OSS polish.

---

## PHASE 3 READINESS

**Can Phase 3 begin immediately?**

**NO**

**Blockers:**
The build cache corruption and test failures completely block any meaningful development. Once these remaining items are implemented, the backend will be fully ready for Phase 3.
