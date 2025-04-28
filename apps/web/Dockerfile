FROM node:22-slim AS runner

WORKDIR /app

RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs \
  && rm -rf /var/lib/apt/lists/*

USER nextjs

COPY .next/standalone ./
COPY .next/static ./apps/web/.next/static
COPY public ./apps/web/public
COPY package.json .

CMD ["node", "apps/web/server.js"]
