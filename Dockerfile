# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10.20.0

# Copy package files
COPY package.json ./
COPY pnpm-lock.yaml* ./
COPY pnpm-workspace.yaml* ./

# Install all dependencies (including devDependencies for build)
RUN pnpm install

# Copy prisma schema
COPY prisma ./prisma

# Generate Prisma Client
RUN pnpm db:generate

# Copy source code
COPY tsconfig.json ./
COPY src ./src

# Build TypeScript (override noEmit)
RUN pnpm build

# Verify build output
RUN ls -la dist/

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10.20.0

# Copy package files
COPY package.json ./
COPY pnpm-lock.yaml* ./
COPY pnpm-workspace.yaml* ./

# Copy prisma schema
COPY --from=builder /app/prisma ./prisma

# Install production dependencies (includes @prisma/client)
RUN pnpm install --prod

# Install prisma CLI temporarily to generate client
RUN pnpm add -D prisma && pnpm db:generate && pnpm remove prisma

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["node", "dist/index.js"]
