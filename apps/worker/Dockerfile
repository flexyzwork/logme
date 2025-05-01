FROM node:22-slim AS runner
WORKDIR /app

RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nodejs \
  && apt-get update -y && apt-get install -y openssl \
  && rm -rf /var/lib/apt/lists/*

USER nodejs

COPY --chown=nodejs:nodejs apps/worker ./apps/worker
COPY --chown=nodejs:nodejs packages ./packages
COPY --chown=nodejs:nodejs pnpm-lock.yaml ./
COPY --chown=nodejs:nodejs turbo.json ./
COPY --chown=nodejs:nodejs tsconfig.* ./
COPY --chown=nodejs:nodejs .turbo ./.turbo

CMD node apps/worker/dist/index.js
