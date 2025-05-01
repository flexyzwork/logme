FROM node:22-slim AS runner
WORKDIR /app

RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nodejs \
  # && apt-get update -y && apt-get install -y openssl \
  && rm -rf /var/lib/apt/lists/*

USER nodejs

COPY --chown=nodejs:nodejs apps/worker/dist ./apps/worker/dist
COPY --chown=nodejs:nodejs node_modules ./node_modules
COPY --chown=nodejs:nodejs apps/worker/node_modules ./apps/worker/node_modules
COPY --chown=nodejs:nodejs apps/worker/package.json ./apps/worker/package.json
COPY --chown=nodejs:nodejs package.json ./package.json


CMD node apps/worker/dist/index.js
