# Chessome Operations Runbook

This runbook outlines day-2 operational procedures for the Chessome backend running on Fly.io, the Vercel frontend, and managed Supabase/Upstash infrastructure.

## 1. Fly.io Backend Operations

### Restart the Backend
To perform a rolling restart of the NestJS application:
```bash
fly apps restart chessome-api
```

### Inspect Logs
To tail the live production logs across all machines:
```bash
fly logs
```
To search historical logs, use Fly's Grafana integration or your configured LogShipper (e.g., Sentry/PostHog).

### Scale the VM
If Stockfish memory spikes cause OOM (Out-of-Memory) errors, increase the VM size:
```bash
fly scale vm shared-cpu-2x --memory 2048
```
To scale horizontally (add more instances behind the Fly proxy):
```bash
fly scale count 3
```

### Rollback Deployment
If a recent deployment introduced a critical bug:
1. List previous deployments: `fly releases --image`
2. Rollback to a specific image: `fly deploy -i <IMAGE_ID>`

### Troubleshoot SSE (Server-Sent Events)
If Stockfish analysis streams are dropping early:
- Verify `auto_stop_machines = false` in `fly.toml`.
- Check if the Fly Proxy timeout is being hit. You may need to add keep-alive ping messages to the SSE stream from the NestJS controller.

---

## 2. Supabase Database Operations

### Rotate Secrets (Database Password)
1. Go to Supabase Dashboard -> **Project Settings** -> **Database** -> **Reset Database Password**.
2. Generate a new secure password.
3. Update the Fly.io Secrets vault:
   ```bash
   fly secrets set DATABASE_URL="postgresql://postgres:[NEW_PASSWORD]@..."
   fly secrets set DIRECT_URL="postgresql://postgres:[NEW_PASSWORD]@..."
   ```
4. Restart the Fly application: `fly apps restart chessome-api`.

### Rotate JWT Secret
1. Go to Supabase Dashboard -> **Project Settings** -> **API** -> **Generate new JWT secret**.
2. Update the Fly.io vault:
   ```bash
   fly secrets set SUPABASE_JWT_SECRET="[NEW_SECRET]"
   ```
3. Restart the Fly application. 
> [!WARNING]
> Rotating the JWT secret will invalidate all current user sessions, forcing everyone to log in again.

### Backup & Restore Database
- **Backups**: Supabase automatically takes daily backups.
- **Restore**: In the Supabase Dashboard, go to **Database** -> **Backups** and select the point-in-time or daily backup you wish to restore.

---

## 3. Upstash Redis Operations

### Investigate Memory Spikes
1. Log into the Upstash Console.
2. View the **Metrics** tab for `electric-woodcock-124750`.
3. If memory usage is consistently hitting the ceiling, check if the BullMQ job queues are backing up, or if cached analysis sessions are not expiring properly (check TTL).

### Rotate Redis Credentials
1. In Upstash, click **Reset Password**.
2. Update Fly.io:
   ```bash
   fly secrets set REDIS_URL="rediss://default:[NEW_PASSWORD]@..."
   ```
3. Restart the Fly application.
