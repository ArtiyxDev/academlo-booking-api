# ==================== BASE STAGE ====================
FROM node:22-alpine AS base
WORKDIR /app

# ==================== DEPENDENCIES STAGE ====================
FROM base AS deps

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./

RUN \
  if [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  else echo "Lockfile not found." && exit 1; \
  fi

# ==================== BUILDER STAGE ====================
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Create temporary .env for Prisma generation
RUN echo "DATABASE_URL=postgresql://placeholder:placeholder@placeholder:5432/placeholder" > .env

# Generate Prisma Client
RUN \
  if [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm prisma generate && pnpm run build; \
  elif [ -f yarn.lock ]; then yarn prisma generate && yarn build; \
  elif [ -f package-lock.json ]; then npx prisma generate && npm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# ==================== PRODUCTION DEPENDENCIES ====================
FROM base AS prod-deps

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./

RUN \
  if [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --prod --frozen-lockfile; \
  elif [ -f yarn.lock ]; then yarn install --prod --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci --only=production; \
  else echo "Lockfile not found." && exit 1; \
  fi

# ==================== PRODUCTION STAGE ====================
FROM base AS prod

ENV NODE_ENV=production

# Copy production dependencies
COPY --from=prod-deps /app/node_modules ./node_modules

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json

# Install prisma CLI for migrations
RUN \
  if [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm add -D prisma; \
  elif [ -f yarn.lock ]; then yarn add -D prisma; \
  elif [ -f package-lock.json ]; then npm install -D prisma; \
  fi

# Create temporary .env for Prisma generation
RUN echo "DATABASE_URL=postgresql://placeholder:placeholder@placeholder:5432/placeholder" > .env

# Generate Prisma Client in production context
RUN \
  if [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm prisma generate; \
  elif [ -f yarn.lock ]; then yarn prisma generate; \
  elif [ -f package-lock.json ]; then npx prisma generate; \
  fi

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start with migrations
CMD ["sh", "-c", "if [ -f pnpm-lock.yaml ]; then pnpm prisma migrate deploy; elif [ -f yarn.lock ]; then yarn prisma migrate deploy; else npx prisma migrate deploy; fi && node dist/index.js"]