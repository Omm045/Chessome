# Chessome: Deployment & CI/CD Architecture

## 1. Core Principles
Chessome must be easy to deploy. The architecture must support both a massive SaaS deployment (the official chessome.org) and a simple 1-click self-hosted deployment for a school club or local researcher.

## 2. Infrastructure as Code (IaC)
- **Tool**: Terraform / OpenTofu.
- **Scope**: All cloud resources (Databases, Redis clusters, VPCs, Kubernetes clusters) are defined in code.
- **Why**: Ensures the production environment is perfectly reproducible and disaster recovery is a matter of running `terraform apply`.

## 3. Containerization (Docker)
Every application in the monorepo is containerized.
- `apps/web` -> `ghcr.io/chessome/web:latest`
- `apps/api` -> `ghcr.io/chessome/api:latest`
- `apps/worker-analysis` -> `ghcr.io/chessome/worker:latest`

## 4. CI/CD Pipeline (GitHub Actions)

### 4.1 Branch Strategy
- **Trunk-Based Development**: All feature branches merge into `main`.
- Pull Requests require passing all Quality Gates (Tests, Linting, Type Checks) before they can be merged.

### 4.2 The CI Pipeline (On Push to PR)
1. **Lint & Format**: Runs `eslint` and `prettier`. Fails on any warning.
2. **Type Check**: Runs `tsc --noEmit`. Fails on any type error.
3. **Unit Tests**: Runs `vitest run`.
4. **Integration Tests**: Spins up Testcontainers and runs API tests.
5. **Build**: Ensures Next.js and NestJS build successfully.

### 4.3 The CD Pipeline (On Merge to Main)
1. **Semantic Release**: Analyzes commit messages (e.g., `feat: add AI`, `fix: board bug`) and automatically bumps the version number (Semantic Versioning).
2. **Docker Build & Push**: Builds the containers and pushes them to GitHub Container Registry.
3. **Deploy to Staging**: Automatically rolls out the new containers to the Staging environment.
4. **E2E Tests**: Playwright runs against the Staging environment.
5. **Promote to Production**: If E2E tests pass, the deployment is rolled out to Production via Kubernetes Rolling Updates (zero-downtime).

## 5. Architectural Decision Records (ADR)

### ADR-DEP-001: Orchestrator Agnostic (Docker Compose + Kubernetes)
- **Why it exists**: The official instance needs Kubernetes to auto-scale analysis workers based on queue depth (using KEDA). A home user just wants `docker-compose up`.
- **Trade-offs**: Maintaining both Helm charts and Docker Compose files.
- **Alternative approaches**: Tying the app to Vercel/Serverless.
- **Future scalability**: Kubernetes is the industry standard for planet-scale deployments.
- **Risks**: Serverless functions (AWS Lambda) do not support long-lived WebSocket connections natively, breaking our real-time engine streaming.
- **Engineering justification**: Chessome is fundamentally incompatible with stateless serverless architecture due to the need for long-running child processes (Stockfish binaries) and stateful WebSockets. We will exclusively target container orchestration (Docker/K8s).

### ADR-DEP-002: Blue/Green vs Rolling Deployments
- **Why it exists**: Chess games are stateful. If the API Gateway restarts, WebSocket connections drop.
- **Trade-offs**: Blue/Green requires 2x the infrastructure during the deploy window.
- **Alternative approaches**: Standard Rolling Updates.
- **Future scalability**: Maximizes uptime.
- **Risks**: Database schema migrations running before the new code is fully active.
- **Engineering justification**: We will use standard Kubernetes Rolling Updates with strict graceful shutdown logic. When a pod receives a `SIGTERM`, it stops accepting new WebSocket connections but allows existing ones to finish their current engine evaluation before shutting down. The frontend client will automatically reconnect with exponential backoff if the socket drops.
