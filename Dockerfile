# Etapa 1: Instalación de dependencias
FROM node:20-alpine AS deps
WORKDIR /app

# Instalar pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copiar archivos de configuración de pnpm
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml .npmrc ./

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Etapa 2: Builder - Compilar TypeScript
FROM node:20-alpine AS builder
WORKDIR /app

# Instalar pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copiar dependencias instaladas
COPY --from=deps /app/node_modules ./node_modules

# Copiar código fuente
COPY . .

# Generar Prisma Client
RUN pnpm db:generate

# Compilar TypeScript
RUN pnpm build

# Etapa 3: Producción
FROM node:20-alpine AS runner
WORKDIR /app

# Instalar pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

ENV NODE_ENV=production

# Copiar archivos necesarios
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml* ./
COPY --from=builder /app/.npmrc ./
COPY --from=builder /app/pnpm-workspace.yaml ./

# Instalar solo dependencias de producción
RUN pnpm install --prod --frozen-lockfile

# Copiar archivos compilados
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Copiar Prisma Client generado
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Crear usuario no privilegiado
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs

USER nodejs

# Exponer puerto
EXPOSE 3000

# Comando de inicio
CMD ["node", "dist/index.js"]
