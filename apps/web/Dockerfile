FROM node:22-slim AS runner

WORKDIR /app

RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs \
  && rm -rf /var/lib/apt/lists/*

USER nextjs

COPY ./apps/web/.next/standalone ./
COPY ./apps/web/.next/static ./apps/web/.next/static
COPY ./apps/web/public ./apps/web/public

CMD ["node", "apps/web/server.js"]
