# Chessome: Quality Gate Checklist (CI/CD)

Every Pull Request opened against the `develop` branch must pass these automated quality gates. **No human can override these gates.** If the build fails, the PR cannot be merged.

## 1. Static Analysis Gates
- [ ] **TypeScript Compiler**: `tsc --noEmit` exits with code 0. (No type errors anywhere in the monorepo).
- [ ] **ESLint**: `eslint .` exits with code 0. No warnings are permitted; all rules are set to `error`.
- [ ] **Prettier**: `prettier --check .` exits with code 0. (Code format is perfect).

## 2. Test Gates
- [ ] **Unit Tests**: `vitest run` passes 100% of suites.
- [ ] **Coverage Drop**: Code coverage must not drop by more than 1% compared to `develop`.
- [ ] **Integration Tests**: Testcontainers successfully boots PostgreSQL, runs migrations, executes tests, and tears down cleanly.

## 3. Build & Performance Gates
- [ ] **Next.js Build**: `next build` completes successfully.
- [ ] **NestJS Build**: `nest build` completes successfully.
- [ ] **Bundle Analyzer**: The Next.js client JavaScript bundle size does not exceed the baseline by more than 20KB.

## 4. Security Gates
- [ ] **Dependency Audit**: `pnpm audit` reports zero High or Critical vulnerabilities.
- [ ] **Secret Scanning**: GitHub Advanced Security (or Trivy) verifies no hardcoded secrets, API keys, or JWT tokens are committed in the diff.

## 5. Branch Strategy Gate
- [ ] The PR target branch is `develop`. (Direct PRs to `main` are automatically rejected by GitHub branch protection rules, except for hotfixes).
