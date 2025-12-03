FROM node:22-slim

WORKDIR /app

COPY . .

RUN npm install
RUN echo "DATABASE_URL=postgresql://user:pass@localhost:5432/db" > .env && \
  npx prisma generate && \
  rm .env
RUN npm run build

EXPOSE 8000
CMD [ "npm", "start" ]