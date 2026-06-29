# Chessome: Contributing & Open Source Strategy

## 1. Product Vision & Community
Chessome is built by the community, for the community. The goal is to create the definitive open-source chess analysis platform.

## 2. Licensing Strategy

### 2.1 The Core Platform: AGPLv3 (GNU Affero General Public License)
- **Scope**: `apps/web`, `apps/api`, `apps/worker-analysis`, and the core domain logic.
- **Why**: AGPLv3 closes the "SaaS loophole". If a massive corporation takes the Chessome code, modifies it to add proprietary features, and hosts it over a network for profit, they MUST release their modifications back to the open-source community. This guarantees the platform remains forever free and protects the community's work from corporate exploitation.

### 2.2 The Plugin SDK & Shared Libraries: MIT License
- **Scope**: `packages/engine-adapters`, `packages/ui`, and plugin interfaces.
- **Why**: We want third-party developers, researchers, and other projects to use our chess logic, parser, and adapters without forcing them to open-source their entire proprietary apps (e.g., if someone wants to build a commercial iOS app using our UCI adapter package, they can).

## 3. Contribution Guidelines

### 3.1 Pull Requests
- Must pass all CI checks (Linting, Types, Tests).
- Must include tests for new functionality.
- Must follow Conventional Commits (e.g., `feat(board): add arrow drawing`).

### 3.2 Architectural Changes
- Any change to the system design, core technologies, or data flow MUST be proposed as an **Architectural Decision Record (ADR)** in the relevant markdown file.
- The PR must include the "Why, Trade-offs, Alternatives, Future scalability, Risks, and Engineering justification."

## 4. Architectural Decision Records (ADR)

### ADR-OSS-001: Banning Proprietary Dependencies
- **Why it exists**: If Chessome relies on a proprietary SDK (e.g., a closed-source chess API), it cannot be fully self-hosted by the community.
- **Trade-offs**: We might have to build things from scratch instead of using easy SaaS tools.
- **Alternative approaches**: Allowing proprietary tools with open-source fallbacks.
- **Future scalability**: Guarantees the project will never die if a vendor shuts down.
- **Risks**: Slower development time.
- **Engineering justification**: No proprietary code may be linked into the core platform. If a proprietary service is used (e.g., OpenAI for explanations), it MUST be accessed via the Plugin Architecture, and the platform MUST gracefully degrade and function perfectly if that plugin is disabled or missing.
