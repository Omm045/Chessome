# Chessome: Configuration Management

## 1. Twelve-Factor App Principles
Chessome strictly follows the Twelve-Factor App methodology. **Configuration is strictly separated from code.** The codebase must be able to be open-sourced entirely without leaking a single secret or environment-specific variable.

## 2. Environment Variables (`.env`)

### 2.1 Strict Typing with Zod
Environment variables are notoriously fragile (`process.env.API_KEY` could be `undefined`).
- We use the `t3-env` (or a custom Zod env parser) pattern.
- The app refuses to boot if a required environment variable is missing or malformed.

```typescript
// packages/env/index.ts
export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    REDIS_URL: z.string().url(),
    JWT_SECRET: z.string().min(32),
  },
  client: {
    NEXT_PUBLIC_API_URL: z.string().url(),
  },
  runtimeEnv: process.env,
});
```

### 2.2 Dev vs Prod
- **Development**: Developers use a local `.env.local` file (gitignored). A `.env.example` provides safe, dummy values.
- **Production**: Environment variables are injected by the orchestrator (Kubernetes ConfigMaps / Secrets). No `.env` file exists in the production Docker container.

## 3. Secrets Management
- Secrets (Database Passwords, OAuth Client Secrets, JWT keys) are NEVER committed to the repository.
- In CI/CD (GitHub Actions), they are stored in GitHub Secrets.
- In Kubernetes, they are managed via ExternalSecrets (syncing from AWS Secrets Manager or HashiCorp Vault).

## 4. Feature Flags (Runtime Configuration)
Not all configuration requires a server restart. We use **Feature Flags** to toggle functionality dynamically without redeploying.

### Use Cases:
- Disabling the Cloud Analysis feature instantly if we are under a DDoS attack or running out of budget.
- Rolling out a new UI redesign to 10% of users.
- Hiding an unfinished feature that was merged to `main` (Trunk-based development).

### Implementation:
- We use an open-source solution like **Unleash** or a simple Redis-backed boolean flag system.
- The Next.js frontend checks the flag via an API call (or cached Server Component read) before rendering the UI component.

## 5. Build-Time vs Runtime Configuration
- **Build-Time**: Things that cannot change without recompiling (e.g., Tailwind themes, Base paths). Managed via `next.config.js`.
- **Runtime**: Things that can change dynamically (API endpoints, Feature flags). Next.js supports runtime configuration, but we prefer fetching dynamic config on app initialization to maintain static HTML generation benefits.
