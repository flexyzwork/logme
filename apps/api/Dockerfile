FROM node:22-slim AS runner

WORKDIR /app

RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nodejs \
  && rm -rf /var/lib/apt/lists/*

USER nodejs

COPY --chown=nodejs:nodejs apps/api/dist ./apps/api/dist
COPY --chown=nodejs:nodejs node_modules ./node_modules
COPY --chown=nodejs:nodejs apps/api/node_modules ./apps/api/node_modules
COPY --chown=nodejs:nodejs apps/api/package.json ./apps/api/package.json
COPY --chown=nodejs:nodejs package.json ./package.json

CMD node apps/api/dist/main.js
