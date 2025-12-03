# ==================== BUILD STAGE ====================
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Enable corepack and pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy dependency files
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./

# Install ALL dependencies
RUN pnpm install || pnpm install --no-frozen-lockfile

# Copy Prisma schema
COPY prisma ./prisma

# Copy Prisma config
COPY prisma.config.ts ./

# Generate Prisma Client (generated in src/generated/prisma)
RUN pnpm prisma generate

# Copy source code (includes src/generated that we just created)
COPY tsconfig.json ./
COPY src ./src

# Build TypeScript
RUN pnpm tsc --noEmit false

# ==================== PRODUCTION STAGE ====================
FROM node:20-alpine

WORKDIR /usr/src/app

# Enable corepack and pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package.json
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./

# Install production dependencies only
RUN pnpm install --prod || pnpm install --prod --no-frozen-lockfile

# Install prisma CLI temporarily for migrations
RUN pnpm add -D prisma

# Copy Prisma schema
COPY prisma ./prisma

# Copy Prisma config
COPY prisma.config.ts ./

# Copy generated Prisma Client from builder
COPY --from=builder /usr/src/app/generated ./src/generated

# Copy compiled code from builder
COPY --from=builder /usr/src/app/dist ./dist

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start command with migrations
CMD ["sh", "-c", "pnpm prisma migrate deploy && node dist/index.js"]