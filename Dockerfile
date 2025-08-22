# Multi-stage optimized production Dockerfile for Next.js
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Dependencies stage
FROM base AS deps
# Copy root package files
COPY package*.json ./
# Copy workspace package files
COPY apps/web/package*.json ./apps/web/
COPY packages/ui/package*.json ./packages/ui/
COPY packages/core-domain/package*.json ./packages/core-domain/
COPY packages/data-access/package*.json ./packages/data-access/

# Install production dependencies
RUN npm ci --omit=dev --workspace=apps/web

# Builder stage
FROM base AS builder
# Copy all package files for building
COPY package*.json ./
COPY apps/web/package*.json ./apps/web/
COPY packages/ui/package*.json ./packages/ui/
COPY packages/core-domain/package*.json ./packages/core-domain/
COPY packages/data-access/package*.json ./packages/data-access/

# Install all dependencies (including dev)
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client
WORKDIR /app/packages/data-access
RUN npx prisma generate

# Build the application
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED 1
ARG NEXT_PUBLIC_API_BASE
ENV NEXT_PUBLIC_API_BASE=$NEXT_PUBLIC_API_BASE
RUN npm run -w apps/web build

# Runner stage
FROM base AS runner
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone application
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

USER nextjs
EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Use the standalone server
CMD ["node", "apps/web/server.js"]