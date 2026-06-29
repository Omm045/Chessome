# Chessome: Security Architecture

## 1. Core Principles
Security in Chessome is designed around **Defense in Depth** and **Privacy by Design**. Because the platform handles user data, API keys (for AI), and executes complex binaries (Engines), strict boundaries must be maintained.

## 2. Threat Modeling & Mitigations

### 2.1 Cross-Site Scripting (XSS)
- **Threat**: A malicious user uploads a PGN with a `<script>` tag hidden in the player name or game comments.
- **Mitigation**: 
  - Strict Content Security Policy (CSP).
  - React automatically escapes string variables.
  - Any Markdown rendering (e.g., in Study chapters) is parsed through `DOMPurify` before rendering `dangerouslySetInnerHTML`.

### 2.2 Cross-Site Request Forgery (CSRF)
- **Threat**: A malicious site forces an authenticated user's browser to execute a state-changing request (e.g., deleting a collection).
- **Mitigation**:
  - `SameSite=Lax` or `Strict` flags on all authentication cookies.
  - Anti-CSRF tokens for mutating requests.

### 2.3 Cloud Analysis Abuse & DDoS
- **Threat**: A botnet submits millions of FENs for Cloud Analysis, exhausting the worker pool and inflating server costs.
- **Mitigation**:
  - Cloudflare rate limiting at the edge.
  - Redis-based rate limiting per User ID in the API Gateway.
  - Maximum queue size limits. If the queue is full, the API returns `503 Service Unavailable` with a `Retry-After` header.

### 2.4 Engine Binary Exploitation
- **Threat**: The UCI protocol is text-based. A malicious PGN/FEN could theoretically trigger a buffer overflow in a native C++ engine (e.g., Stockfish) running on the cloud worker.
- **Mitigation**:
  - FEN strings are strictly validated using a Regex and a logical chess validator *before* being passed to the engine.
  - Cloud workers run engines inside isolated, unprivileged Docker containers or `cgroups` with strict memory limits and dropped Linux capabilities.

## 3. Data Privacy & API Keys
- Users who provide an OpenAI/Anthropic API key will have their key stored strictly on the client-side (`localStorage`), or if server-side storage is requested, symmetrically encrypted using a Hardware Security Module (HSM) or a secure KMS (Key Management Service).
- Chessome strictly adheres to GDPR. "Delete Account" performs a hard cascade delete of all PII. (Anonymous game evaluations remain, as they are decoupled from the user).

## 4. Architectural Decision Records (ADR)

### ADR-SEC-001: Rate Limiting Algorithm
- **Why it exists**: We must differentiate between a user analyzing a game (many rapid requests as they click through moves) and a scraper hitting the API.
- **Trade-offs**: Aggressive rate limiting frustrates legitimate power users.
- **Alternative approaches**: Fixed Window (prone to burst attacks).
- **Future scalability**: Token Bucket allows for smooth scaling.
- **Risks**: Redis becoming a bottleneck for rate-limit checks on every request.
- **Engineering justification**: We will implement a **Token Bucket** algorithm via Redis. Users get a burst allowance (e.g., 50 rapid requests) that replenishes slowly (e.g., 2 requests per second). This perfectly accommodates the behavior of a human clicking rapidly through an opening tree, while stopping automated scrapers dead.

### ADR-SEC-002: Role-Based Access Control (RBAC)
- **Why it exists**: Future features may require Admin or Moderator roles (e.g., moderating public studies).
- **Trade-offs**: Over-engineering permissions early on slows development.
- **Alternative approaches**: Simple `isAdmin` boolean on the User table.
- **Future scalability**: Allows granular permissions (e.g., `can:view:admin_dashboard`, `can:ban:user`).
- **Risks**: Complex permission resolution logic in API requests.
- **Engineering justification**: We will implement a lightweight RBAC system using Guards in NestJS. Permissions are attached to Roles, and Roles to Users. The default role is `USER`. This avoids the `isAdmin` trap and scales gracefully as the community team grows.
