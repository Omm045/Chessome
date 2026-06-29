# Chessome: Risk Register

## 1. Overview
The engineering risk register tracks known architectural vulnerabilities, scaling limits, and external dependencies that could jeopardize the platform's stability.

## 2. Active Risks

### RISK-001: Runaway Cloud Compute Costs
- **Description**: A malicious actor or botnet submits thousands of complex games for deep cloud analysis, exhausting server CPU capacity and resulting in massive cloud hosting bills.
- **Probability**: High (if public).
- **Impact**: Critical (Financial ruin for open-source project).
- **Detection Strategy**: Grafana alerts on Redis queue depth > 1000 and Cloudflare WAF billing spike alerts.
- **Mitigation Plan**: Strict Token Bucket rate limiting per IP/User. Cap the maximum number of cloud workers to a fixed budget pool (e.g., max 10 EC2 instances). If the queue backs up, it backs up; we do not auto-scale indefinitely.
- **Recovery Plan**: Manually flush the Redis queue and temporarily disable anonymous cloud analysis via LaunchDarkly/Feature Flags.

### RISK-002: Lichess/Chess.com API Rate Limit Bans
- **Description**: The platform fetches user games too aggressively, causing Lichess or Chess.com to permanently IP-ban our backend servers.
- **Probability**: Medium.
- **Impact**: High (Core feature breaks).
- **Detection Strategy**: Monitoring `429 Too Many Requests` responses in OpenTelemetry API traces.
- **Mitigation Plan**: Implement strict internal throttling (e.g., max 1 request/sec to external providers globally). Cache results aggressively.
- **Recovery Plan**: Rotate egress IP addresses and contact provider support to establish a partner agreement.

### RISK-003: Browser Out-Of-Memory (OOM) on WASM Engine
- **Description**: Loading the 50MB Stockfish NNUE file and allocating 128MB of Hash tables crashes Safari on older iOS devices.
- **Probability**: High.
- **Impact**: Medium (App crashes for a subset of mobile users).
- **Detection Strategy**: Client-side OpenTelemetry capturing `Out of Memory` fatal exceptions.
- **Mitigation Plan**: Detect device memory via `navigator.deviceMemory`. If memory is < 4GB, automatically disable NNUE and fallback to classical HCE (Hand-Crafted Evaluation) Stockfish which uses < 5MB RAM.
- **Recovery Plan**: Issue a hotfix modifying the WASM initialization parameters.

### RISK-004: WebSocket Connection Storms
- **Description**: During a massive e-sports chess event (e.g., World Championship), 50,000 users connect simultaneously to watch live engine analysis, crashing the NestJS API Gateways via connection exhaustion.
- **Probability**: Low/Medium.
- **Impact**: Critical (Platform goes offline).
- **Detection Strategy**: API Gateway CPU spikes to 100% and connection timeouts.
- **Mitigation Plan**: Terminate WebSockets at the load balancer level if possible. Horizontally scale the stateless NestJS gateways early. Use Redis Pub/Sub efficiently (batching evaluation broadcasts instead of 1-to-1).
- **Recovery Plan**: Gracefully reject new WebSocket connections with a fallback to HTTP Long Polling (every 5 seconds) until load stabilizes.

### RISK-005: PGN Parsing Regex Denial of Service (ReDoS)
- **Description**: A user uploads a maliciously crafted PGN string containing massive nested variations designed to cause exponential backtracking in the parsing regex, freezing the Node.js event loop.
- **Probability**: Low.
- **Impact**: High (Backend instance becomes unresponsive).
- **Detection Strategy**: APM detecting API requests taking > 10 seconds with 100% CPU lock.
- **Mitigation Plan**: Never use complex regex for parsing. Use a strict lexer/parser (AST based) written in Rust/WASM or heavily audited JS (like `chess.js`). Enforce a hard maximum file size (e.g., 1MB) for PGN uploads.
- **Recovery Plan**: Kubernetes health checks will notice the event loop is blocked and automatically restart the pod.
