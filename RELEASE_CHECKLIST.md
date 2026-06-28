# Chessome: Release Checklist

This checklist is executed before promoting the `develop` branch to `main` (Production Release).

## 1. Automated Pre-Flight (Staging)
When `develop` has accumulated enough features for a release, a Release Candidate (RC) is deployed to the Staging Environment.

- [ ] **Playwright E2E**: The full End-to-End test suite runs against the live Staging URLs.
- [ ] **Load Test**: `k6` executes a 5-minute simulated load of 1,000 concurrent WebSockets against Staging to verify memory stability.
- [ ] **Lighthouse**: CI runs Google Lighthouse against the Staging homepage. Performance, Accessibility, Best Practices, and SEO scores must all be > 90.

## 2. Manual Pre-Flight
Automated tests cannot catch everything. A maintainer must manually verify the "feel" of the application.
- [ ] **Cross-Browser Verification**: Open the Analysis Board in Safari (iOS) and Chrome (Android). Verify piece dragging feels native and 60fps.
- [ ] **WASM Fallback**: Simulate a slow 3G connection in Chrome DevTools. Verify the 50MB NNUE file download fails gracefully and the engine falls back to HCE (Hand-Crafted Evaluation).
- [ ] **Database Migration Review**: Manually inspect the generated `migration.sql` file from Prisma. Ensure there are no destructive `DROP TABLE` or `DROP COLUMN` commands that would cause downtime during the rolling deployment.

## 3. Execution (Semantic Release)
- [ ] A Maintainer creates a Pull Request from `develop` -> `main`.
- [ ] Upon merge, GitHub Actions triggers the Semantic Release plugin.
- [ ] Version number is bumped automatically based on commit tags (`fix:` vs `feat:`).
- [ ] A GitHub Release is created, generating the `CHANGELOG.md`.
- [ ] Docker Images are tagged with the new version (e.g., `v1.2.0`) and pushed to the registry.

## 4. Post-Release Verification (Production)
- [ ] Monitor the OpenTelemetry / Grafana dashboard for exactly 15 minutes post-release.
- [ ] Look for spikes in HTTP 500 errors.
- [ ] Look for a drop in active WebSocket connections.
- [ ] **Rollback**: If fatal errors are detected, immediately run the Kubernetes rollback command to restore the previous Docker tag.
