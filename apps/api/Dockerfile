# Base Node image
FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Builder stage
FROM base AS builder
WORKDIR /app

# Copy all source code (this ensures all workspace package.jsons are present for pnpm install)
COPY . .

# Install dependencies
RUN pnpm install --frozen-lockfile

# Generate Prisma Client
RUN pnpm --filter @chessome/database db:generate

# Build the API
RUN pnpm --filter @chessome/api build

# Runner stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV PORT 4000

# Copy necessary files from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/
COPY --from=builder /app/packages ./packages

EXPOSE 4000

CMD ["node", "apps/api/dist/main.js"]
