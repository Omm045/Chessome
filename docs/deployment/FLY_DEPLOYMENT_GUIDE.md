# Fly.io Deployment Guide for Chessome

This document covers the end-to-end process of deploying the Chessome backend API on [Fly.io](https://fly.io/). It covers authentication, secrets management, deployment, scaling, and database migration strategies specifically tailored for our architecture.

## 1. Prerequisites

Before you begin, ensure you have the Fly CLI (`flyctl`) installed on your system.

### Install Fly CLI
- **macOS/Linux**: `curl -L https://fly.io/install.sh | sh`
- **Windows**: `pwsh -Command "iwr https://fly.io/install.ps1 -useb | iex"`

### Authentication
Run the following command to log in to your Fly account:
```bash
fly auth login
```

## 2. Infrastructure Overview

The backend relies on `fly.toml` located at the root of the repository. This configuration instructs Fly to use our multi-stage `apps/api/Dockerfile` for the build process, exposing port `4000` via Fly's HTTP proxy.

## 3. Secrets Management

Before launching, you must inject the necessary environment variables securely into Fly.io. Unlike Vercel, Fly uses a secrets vault.

Run the following commands, substituting the placeholders with the actual values:

```bash
fly secrets set DATABASE_URL="postgresql://..."
fly secrets set DIRECT_URL="postgresql://..."
fly secrets set SUPABASE_JWT_SECRET="..."
fly secrets set REDIS_URL="rediss://..."
```

## 4. Deployment

To trigger a deployment, use the provided deployment script:

```bash
./scripts/deploy.sh
```

### What happens during deployment?
1. Fly.io builds the multi-stage Docker image using `apps/api/Dockerfile`.
2. Fly.io spins up a new Machine using the `shared-cpu-1x` instance.
3. The `deploy.sh` script automatically connects to the VM via `fly ssh console` to execute `npx prisma db push --schema packages/database/prisma/schema.prisma`.
4. The NestJS API process launches.

> [!WARNING]  
> We use `npx prisma db push` exclusively for the **Alpha deployment** because the database is currently empty and we are running on the Supabase Free Tier.
> 
> **For all future deployments (Beta/Prod):**
> You MUST switch this command in `scripts/deploy.sh` to `npx prisma migrate deploy` to avoid irreversible schema drift.

## 5. Operations & Monitoring

### Health Checks
The `fly.toml` configuration automatically checks the `/v1/health` endpoint every 15 seconds. You can also trigger a manual check:
```bash
./scripts/healthcheck.sh
```

### Viewing Logs
To stream production logs directly from the running containers:
```bash
./scripts/logs.sh
# or manually
fly logs
```

### Rollbacks
If a deployment fails or introduces regressions, you can instantly rollback to a previous image:
```bash
./scripts/rollback.sh
```

## 6. Optimization & Scaling

Currently, the `fly.toml` configuration provisions a `shared-cpu-1x` instance with `512mb` memory. Because Stockfish relies on WASM or native binaries, engine workers are highly CPU-dependent.

To scale the instance size vertically to accommodate heavier analysis loads:
```bash
fly scale vm shared-cpu-2x --memory 1024
```

To scale horizontally:
```bash
fly scale count 3
```

## 7. Troubleshooting

- **Server-Sent Events (SSE) Breaking**: Ensure `auto_stop_machines` is set to `false` in `fly.toml` to prevent Fly.io from aggressively sleeping the instance while a long-running SSE stream is active.
- **Database Connection Issues**: Verify the `DATABASE_URL` connects to the correct Supabase IPv6 endpoint, as Fly.io fully supports IPv6 routing.

## 8. GitHub Release Strategy

After a successful deployment passes all health checks, it is critical to formalize the release rather than relying solely on git tags.

1. Navigate to your GitHub repository -> **Releases** -> **Draft a new release**.
2. Select the `v0.5.0-alpha` tag.
3. Include the following sections in your release notes:
   - **Changelog**: Detailed list of features (Phase 1 through 3.11).
   - **Screenshots**: Attach images of the Analysis Dashboard and Import Library.
   - **Known Issues**: E.g., Stockfish RAM limits on 1GB instances, missing Lichess OAuth integration.
   - **Roadmap**: Next steps towards Phase 4 (AI Coach Integration).
