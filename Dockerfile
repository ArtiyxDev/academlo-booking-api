FROM node:22-slim
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

COPY . .

RUN pnpm install --frozen-lockfile
RUN echo "DATABASE_URL=postgresql://user:pass@localhost:5432/db" > .env && \
  pnpm prisma generate && \
  rm .env
RUN pnpm run build

EXPOSE 8000
CMD [ "pnpm", "start" ]