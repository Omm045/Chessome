# Chessome: Architecture Decision Records (ADR) Log

## 1. The ADR Process
Any change that fundamentally alters the system's architecture, technology stack, or data flow must be documented as an Architecture Decision Record (ADR). This ensures future contributors understand *why* a decision was made, even if the original author has left the project.

### ADR Template
Every ADR must follow this exact format:
```markdown
### ADR-[CATEGORY]-[NUMBER]: [Title]
- **Context**: What is the problem we are trying to solve?
- **Decision**: What is the chosen solution?
- **Alternatives considered**: What else did we try and why did we reject it?
- **Consequences**: What becomes easier/harder because of this decision?
- **Future impact**: How does this scale in 5 years?
```

## 2. Master ADR Index
This log aggregates the major decisions made during the initial architectural design phase.

### Architecture & System (ARC/SYS)
- **[ADR-ARC-001]**: Monorepo with TypeScript. (See `ARCHITECTURE.md`)
- **[ADR-ARC-002]**: Hexagonal Architecture for Engines. (See `ARCHITECTURE.md`)
- **[ADR-SYS-001]**: Local (Browser) vs Cloud Analysis defaults. (See `SYSTEM_DESIGN.md`)
- **[ADR-SYS-002]**: Real-time Streaming via Redis Pub/Sub. (See `SYSTEM_DESIGN.md`)

### Engines & Pipelines (ENG/PIPE/PLG)
- **[ADR-ENG-001]**: WebAssembly as the Primary Free Tier Engine. (See `ENGINE_ARCHITECTURE.md`)
- **[ADR-ENG-002]**: Abstracting Evaluation Scores to standard formats. (See `ENGINE_ARCHITECTURE.md`)
- **[ADR-PIPE-001]**: Win Probability (WDL) over Centipawns for Classification. (See `ANALYSIS_PIPELINE.md`)
- **[ADR-PIPE-002]**: Streaming Analysis Responses vs Batching. (See `ANALYSIS_PIPELINE.md`)
- **[ADR-PLG-001]**: Strict Isolation of Plugins (Compiled vs Sandboxed). (See `PLUGIN_SYSTEM.md`)
- **[ADR-PLG-002]**: Adapter Strategy for Breaking External API Changes. (See `PLUGIN_SYSTEM.md`)

### AI Integration (AI)
- **[ADR-AI-001]**: Client-side Key Storage vs Server-side Encryption. (See `AI_INTEGRATION.md`)
- **[ADR-AI-002]**: Prompt Versioning and Management via YAML. (See `AI_INTEGRATION.md`)

### Frontend & Design (FE/DS)
- **[ADR-FE-001]**: Separation of Engine State from React State (Zustand + DOM mutation). (See `FRONTEND_ARCHITECTURE.md`)
- **[ADR-FE-002]**: Progressive Web App (PWA) Offline Capabilities. (See `FRONTEND_ARCHITECTURE.md`)
- **[ADR-DS-001]**: Rejection of CSS-in-JS in favor of Tailwind CSS. (See `DESIGN_SYSTEM.md`)
- **[ADR-DS-002]**: Keyboard-First Navigation standard. (See `DESIGN_SYSTEM.md`)

### Backend, API, & DB (BE/DB/API)
- **[ADR-BE-001]**: NestJS over raw Express/Fastify. (See `BACKEND_ARCHITECTURE.md`)
- **[ADR-BE-002]**: CQRS for Game Data reading vs writing. (See `BACKEND_ARCHITECTURE.md`)
- **[ADR-DB-001]**: Storing PGNs vs Storing Move Trees in SQL. (See `DATABASE.md`)
- **[ADR-DB-002]**: Bypassing Prisma for bulk inserts using Raw SQL. (See `DATABASE.md`)
- **[ADR-API-001]**: REST over GraphQL for the Core Platform. (See `API_SPECIFICATION.md`)
- **[ADR-API-002]**: Zod for Request/Response Validation across full-stack. (See `API_SPECIFICATION.md`)

### Security & Authentication (SEC/AUTH)
- **[ADR-AUTH-001]**: HttpOnly Cookies over Authorization Headers for Web Clients. (See `AUTHENTICATION.md`)
- **[ADR-AUTH-002]**: Zero-Knowledge Platform (Guest Mode). (See `AUTHENTICATION.md`)
- **[ADR-SEC-001]**: Token Bucket Rate Limiting Algorithm. (See `SECURITY.md`)
- **[ADR-SEC-002]**: Lightweight Role-Based Access Control (RBAC). (See `SECURITY.md`)

### Dev, Test & Deploy (DEV/TST/OBS/DEP)
- **[ADR-DEV-001]**: Strict Linting and Formatting as Pre-Commit Hooks. (See `DEV_ENVIRONMENT.md`)
- **[ADR-DEV-002]**: Mandating Seed Data for Local Development. (See `DEV_ENVIRONMENT.md`)
- **[ADR-TST-001]**: Playwright over Cypress for Web Worker testing. (See `TESTING_STRATEGY.md`)
- **[ADR-TST-002]**: Testcontainers for Database Integration instead of mocks. (See `TESTING_STRATEGY.md`)
- **[ADR-OBS-001]**: OpenTelemetry as the Universal Observability Standard. (See `OBSERVABILITY.md`)
- **[ADR-OBS-002]**: Client-Side Telemetry (Strict Opt-in). (See `OBSERVABILITY.md`)
- **[ADR-DEP-001]**: Orchestrator Agnostic (Docker Compose + K8s). (See `DEPLOYMENT.md`)
- **[ADR-DEP-002]**: Standard Rolling Deployments over Blue/Green. (See `DEPLOYMENT.md`)

### Strategic (COMP/OSS/CS)
- **[ADR-COMP-001]**: Abandoning "Play" Features to focus on Analysis. (See `COMPETITIVE_MATRIX.md`)
- **[ADR-OSS-001]**: Banning Proprietary Dependencies in Core. (See `CONTRIBUTING.md`)
- **[ADR-CS-001]**: Zod for all External I/O parsing. (See `CODING_STANDARDS.md`)
- **[ADR-CS-002]**: Error Boundaries and Result Types (avoiding throws). (See `CODING_STANDARDS.md`)
