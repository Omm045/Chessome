# Chessome: Architecture Document

## 1. High-Level Architecture Overview

Chessome is designed as a distributed, cloud-native application using **Clean Architecture** and **Hexagonal Architecture (Ports and Adapters)**. The platform is decoupled into distinct boundaries: Presentation, Application, Domain, and Infrastructure.

The project is structured as a **Monorepo** to share domain logic, types, and plugin interfaces between the frontend web application, backend API, background workers, and future native clients.

## 2. Platform Strategy & Monorepo

### 2.1 Workspaces
The monorepo (managed via Turborepo or Nx) is divided into:
- `apps/web`: The responsive web application.
- `apps/api`: The core REST/GraphQL backend.
- `apps/worker-analysis`: The background worker for cloud engine execution.
- `apps/worker-sync`: The background worker for third-party API synchronization.
- `packages/core`: Pure domain logic, chess rules, FEN/PGN parsers.
- `packages/engine-adapters`: UCI protocol wrappers and WASM loaders.
- `packages/database`: Prisma schema, migrations, and repository implementations.
- `packages/ui`: Shared design system components (React).

### 2.2 Future Platform Support
By extracting pure domain logic into `packages/core` and keeping the backend as a headless API, future clients (Android, iOS via React Native; Desktop via Tauri/Electron) can consume the exact same ecosystem without rewriting business logic.

## 3. Technology Selection

### 3.1 Frontend Web Application
- **Framework**: **Next.js (App Router)**
- **Why**: Excellent SEO for public games, built-in API routes for BFF (Backend-for-Frontend) patterns, robust caching, and standard React ecosystem.
- **Alternatives**: Vite + React (SPA).
- **Trade-offs**: Next.js adds server overhead compared to a pure SPA, but server-side rendering (SSR) is crucial for sharing chess analysis links with proper OpenGraph meta tags.

### 3.2 Backend API Services
- **Framework**: **NestJS (Node.js)**
- **Why**: Opinionated, heavily structure-driven, enforces Dependency Injection (crucial for our Plugin Architecture), and uses strict TypeScript. It naturally supports Hexagonal Architecture.
- **Alternatives**: Go, Rust, Express.
- **Trade-offs**: Node.js is single-threaded and slower than Go/Rust for raw compute, but our compute-heavy tasks (engines) are spawned as separate binary processes or WASM. NestJS allows code-sharing with the frontend.

### 3.3 Database Layer
- **Primary Database**: **PostgreSQL**
  - **Why**: ACID compliant, highly relational (Users -> Games -> Moves -> Evaluations), supports JSONB for extensible plugin data, and scales vertically well.
- **Caching & Queues**: **Redis**
  - **Why**: Extremely fast pub/sub for WebSocket live analysis streaming. Required for BullMQ to handle background analysis queues.
- **ORM**: **Prisma**
  - **Why**: Exceptional TypeScript safety.

### 3.4 Language & Tooling
- **Language**: **Strict TypeScript (v5+)** across the entire stack.
- **Build System**: **Turborepo** for caching monorepo builds.
- **Package Manager**: **pnpm** for strict dependency resolution and speed.

## 4. Architectural Principles

- **Clean Architecture**: The Domain layer (`packages/core`) has ZERO dependencies on frameworks, databases, or HTTP.
- **Dependency Inversion**: Engines and AI providers are injected at runtime via Interfaces (e.g., `IChessEngine`, `IAIProvider`).
- **Feature-First Architecture**: Grouping files by domain feature (e.g., `features/analysis`, `features/openings`) rather than technical type (`controllers`, `services`).
- **SOLID, DRY, KISS**: No duplicated logic. Shared validation schemas (Zod) between frontend and backend.

## 5. Architectural Decision Records (ADR)

### ADR-ARC-001: Monorepo with TypeScript
- **Why it exists**: Sharing types (e.g., the complex structure of an Engine Evaluation) between the API, Web, and Workers prevents drift and runtime bugs.
- **Trade-offs**: Monorepos can become large and require complex CI/CD caching to keep build times low.
- **Alternative approaches**: Polyrepo (separate repos for web, api, workers).
- **Future scalability**: Easy to add a React Native app that imports `packages/ui` and `packages/core`.
- **Risks**: Tight coupling if module boundaries are not respected.
- **Engineering justification**: Strict ESLint rules (e.g., `@nx/enforce-module-boundaries`) will physically prevent circular or invalid dependencies between layers.

### ADR-ARC-002: Hexagonal Architecture for Engines
- **Why it exists**: We must support Stockfish today, and potentially a completely new AI-based engine tomorrow.
- **Trade-offs**: Requires writing adapter classes for every engine, increasing initial boilerplate.
- **Alternative approaches**: Hardcoding UCI (Universal Chess Interface) parsing directly into the analysis service.
- **Future scalability**: Allows third-party developers to write plugins for custom experimental engines without touching core code.
- **Risks**: Abstracting too much might hide specific optimization features of individual engines.
- **Engineering justification**: The domain requires flexibility. Abstracting the "Engine" behind an interface guarantees the core system is agnostic to *how* a move is evaluated, only caring about the resulting Centipawn/Mate score.
