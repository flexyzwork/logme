FROM node:22-slim AS runner

WORKDIR /app

RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nodejs \
  && rm -rf /var/lib/apt/lists/*

USER nodejs

COPY --chown=nodejs:nodejs apps/api ./apps/api
COPY --chown=nodejs:nodejs packages ./packages
COPY --chown=nodejs:nodejs pnpm-lock.yaml ./
COPY --chown=nodejs:nodejs turbo.json ./
COPY --chown=nodejs:nodejs tsconfig.* ./
COPY --chown=nodejs:nodejs .turbo ./.turbo

CMD node apps/api/dist/main.js
