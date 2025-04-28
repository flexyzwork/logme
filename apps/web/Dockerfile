FROM node:22-slim AS runner

WORKDIR /app

RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs \
  && rm -rf /var/lib/apt/lists/*

USER nextjs

COPY apps/web/.next/ ./.next/
COPY apps/web/public/ ./public/
COPY package.json .

CMD ["node", ".next/standalone/server.js"]
