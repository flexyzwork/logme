FROM node:20-alpine AS pruner
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=@apps/worker --docker


FROM node:20-alpine AS installer
WORKDIR /app
COPY --from=pruner /app/out/json .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/turbo.json ./turbo.json
RUN npm install -g pnpm
RUN pnpm install --no-frozen-lockfile


FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=installer /app/ .
COPY --from=pruner /app/out/full .
RUN npm install -g pnpm
RUN pnpm run build


FROM node:20-alpine AS template
WORKDIR /app/template
COPY ./apps/worker/templates/next-notion-starter/pnpm-lock.yaml ./
COPY ./apps/worker/templates/next-notion-starter/package.json ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile && pnpm store prune && rm -rf ~/.cache
COPY ./apps/worker/templates/next-notion-starter/ ./


FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN npm install -g pnpm
COPY --from=builder /app/ .
COPY --from=template /app/template/ ./template

CMD ["node", "apps/worker/dist/index"]