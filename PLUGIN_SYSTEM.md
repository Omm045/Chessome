# Chessome: Plugin System

## 1. Overview
To ensure Chessome remains extensible and community-driven, core subsystems are designed using a Plugin Architecture. This prevents vendor lock-in, encourages community contributions, and keeps the core repository clean from proprietary third-party SDKs.

## 2. Plugin Architecture

Plugins in Chessome are dynamic modules that adhere to strict TypeScript interfaces. They are registered at application boot via Dependency Injection (NestJS Modules).

### 2.1 Types of Plugins

1. **Chess Provider Plugins**:
   - Interface: `IChessProvider`
   - Purpose: Fetching user profiles, game history, and live game events.
   - Implementations: `ChessComPlugin`, `LichessPlugin`.

2. **Engine Provider Plugins**:
   - Interface: `IEngineProvider`
   - Purpose: Managing local binaries, WASM files, or remote API connections for engines.
   - Implementations: `StockfishLocalPlugin`, `ExternalUciServerPlugin`.

3. **AI Provider Plugins**:
   - Interface: `IAIProvider`
   - Purpose: Generating natural language explanations given a position and engine evaluation.
   - Implementations: `OpenAIPlugin`, `AnthropicPlugin`, `OllamaPlugin`.

4. **Data Export/Import Plugins**:
   - Interface: `IDataMigrationPlugin`
   - Purpose: Allowing users to export their repertoires or import data from other platforms (e.g., ChessBase CTG/CBV converters).

## 3. Plugin Registration & Lifecycle

```typescript
// Example Plugin Registration in the DI Container
export const ProviderModule = Module({
  imports: [
    PluginManagerModule.register({
      aiProviders: [new OpenAIPlugin(), new OllamaPlugin()],
      chessProviders: [new LichessPlugin(), new ChessComPlugin()],
    })
  ]
});
```

### 3.1 Lifecycle Hooks
Plugins must implement lifecycle hooks:
- `onInit()`: Setup connections, validate API keys.
- `onHealthCheck()`: Ping external services (e.g., check if Ollama is running locally).
- `onShutdown()`: Gracefully close connections.

## 4. Plugin Permissions Model

To support third-party, community-authored plugins safely in Phase 3, Chessome implements a strict capability-based permissions model. Plugins must declare their required permissions in a `plugin.json` manifest.

### 4.1 Permission Scopes
- **`net:allow`**: Array of domains the plugin can make HTTP requests to (e.g., `["api.lichess.org"]`). Requests to undeclared domains are blocked by the NestJS HTTP proxy interceptor.
- **`fs:read` / `fs:write`**: Scoped strictly to the plugin's temporary working directory (e.g., `/tmp/chessome/plugins/{pluginId}/`). Plugins cannot read the host OS files or `.env` files.
- **`env:read`**: Array of specific environment variable keys the plugin needs. It is never given access to `process.env`.
- **`db:access`**: Plugins do not get direct SQL access. They must use the core application's Data Access Layer (Repositories) which enforces user isolation.
- **`webhooks:register`**: Allows the plugin to expose an inbound webhook route (e.g., `/v1/plugins/my-plugin/webhook`).

### 4.2 Security Enforcement
If a community plugin (e.g., an experimental engine) is installed, the platform parses `plugin.json`. The administrator must explicitly grant these scopes in the UI before the plugin boots.

## 5. Architectural Decision Records (ADR)

### ADR-PLG-001: Strict Isolation of Plugins
- **Why it exists**: A badly written community plugin (e.g., a memory leak in a custom engine adapter) could crash the main API server.
- **Trade-offs**: True isolation requires running plugins in separate processes or sandboxed environments (V8 Isolates), increasing latency and complexity.
- **Alternative approaches**: Direct compilation into the main monolith.
- **Future scalability**: True sandboxing allows for an "App Store" of community plugins hosted directly on the platform.
- **Risks**: V8 Isolates (like Cloudflare Workers) are complex to orchestrate locally.
- **Engineering justification**: In Phase 1, plugins will be first-party TypeScript modules compiled directly into the monolith, relying on interface compliance and strict PR reviews. In Phase 3, we will investigate sandboxing (e.g., executing untrusted plugins via WebAssembly or Deno Deploy) utilizing the Permissions Model outlined in Section 4.

### ADR-PLG-002: Adapter Strategy for Breaking Changes
- **Why it exists**: External APIs (Chess.com, Lichess, OpenAI) change frequently. The core platform should not need an emergency patch if OpenAI changes a parameter name.
- **Trade-offs**: Adding an adapter layer means new features in third-party APIs aren't immediately available until the adapter is updated.
- **Alternative approaches**: Passing raw configuration JSON directly to the plugins.
- **Future scalability**: Adapters ensure the Core Domain remains pristine and unpolluted by external vendor logic.
- **Risks**: Maintaining adapters requires active community effort.
- **Engineering justification**: We enforce a strict Hexagonal Architecture. The Core defines what it needs (e.g., `FetchRecentGamesRequest`), and the `ChessComPlugin` adapter translates that into the specific HTTP request.
