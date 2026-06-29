# Chessome: Observability & Monitoring

## 1. Philosophy
"If you can't measure it, you can't improve it." Chessome requires enterprise-grade observability to track the performance of cloud engine workers, API response times, and WebSocket connection health. 

## 2. The Three Pillars of Observability

### 2.1 Logging (Structured Logs)
- All services output logs in **JSON format**. This allows log aggregators to query specific fields (e.g., `level: "error" AND event: "engine_crash"`).
- **Library**: `Pino` (for Node.js/NestJS). It is asynchronous and has zero performance impact on the main event loop.
- **Log Levels**: 
  - `DEBUG`: Engine raw UCI output (only in dev).
  - `INFO`: Job started, job finished.
  - `WARN`: High memory usage, slow database query.
  - `ERROR`: Unhandled exceptions, worker crashes.

### 2.2 Metrics (Prometheus/Grafana)
- Services expose a `/metrics` endpoint.
- **Key Metrics Tracked**:
  - Active WebSocket connections.
  - Jobs in queue vs processing.
  - Engine evaluation speed (Nodes Per Second - NPS) per worker.
  - API HTTP response times (p95, p99).
  - Database connection pool utilization.

### 2.3 Tracing (OpenTelemetry)
- **Why**: When a user uploads a PGN, the request bounces from the API Gateway -> Redis Queue -> Worker Node -> Postgres DB. Tracing allows us to follow that exact request across microservices.
- **Standard**: OpenTelemetry (OTel). A single `trace_id` is passed through HTTP headers and Redis metadata.

## 3. Incident Response & Alerting
- Alerts are configured in Prometheus/Alertmanager.
- **Critical Alerts** (Pages the on-call maintainer):
  - API Gateway HTTP 500 rate > 5%.
  - Queue depth > 5000 (indicates worker fleet has crashed or stalled).
  - Database CPU > 90%.

## 4. Architectural Decision Records (ADR)

### ADR-OBS-001: OpenTelemetry as the Universal Standard
- **Why it exists**: Vendor lock-in with APM tools (Datadog, New Relic) is expensive.
- **Trade-offs**: Setting up an OpenTelemetry Collector adds infrastructure overhead.
- **Alternative approaches**: Proprietary APM agents.
- **Future scalability**: The OTel Collector can route data to Prometheus (free/open-source) today, and Datadog (enterprise) tomorrow, without changing a single line of application code.
- **Risks**: High volume of trace spans can consume massive disk space.
- **Engineering justification**: Chessome is an open-source project. Hardcoding proprietary Datadog SDKs violates the philosophy. We instrument the code strictly with `@opentelemetry/api`. Community hosters can point the telemetry data wherever they like.

### ADR-OBS-002: Client-Side Telemetry (Strict Opt-in)
- **Why it exists**: We need to know if the WASM engine is crashing in Safari on iOS, but we must respect user privacy.
- **Trade-offs**: Blind spots in frontend performance if users opt-out.
- **Alternative approaches**: Sentry with forced injection.
- **Future scalability**: Builds community trust through transparency.
- **Risks**: Difficulty debugging client-specific WASM memory limits.
- **Engineering justification**: Chessome is Privacy-First. By default, NO client-side errors or telemetry are sent to the server. Users will be presented with a clear, honest prompt in the settings: "Help improve Chessome by sharing anonymous crash reports." If enabled, an OpenTelemetry browser SDK will dispatch error traces to our collector. No PII is ever included.
