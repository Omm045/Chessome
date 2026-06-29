# Base Node image
FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Builder stage
FROM base AS builder
WORKDIR /app

# Copy package configurations
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/core/package.json ./packages/core/
COPY packages/types/package.json ./packages/types/
COPY packages/database/package.json ./packages/database/
COPY packages/ports/package.json ./packages/ports/
COPY packages/application/package.json ./packages/application/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma Client
RUN pnpm --filter database run build || true
WORKDIR /app/packages/database
RUN npx prisma generate
WORKDIR /app

# Build the API
RUN pnpm --filter api run build

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
