FROM node:22-slim AS runner

WORKDIR /app

RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nodejs \
  && rm -rf /var/lib/apt/lists/*

USER nodejs

COPY . .

CMD node apps/worker/dist/index.js
