FROM node:22-slim AS base

FROM base AS pruner

RUN npm install -g turbo pnpm
WORKDIR /app
COPY . .
# 필터링하지 말고 전체 터보 푸룬 도커
RUN turbo prune web --docker



FROM base AS builder
RUN npm install -g pnpm
WORKDIR /app
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile

COPY --from=pruner /app/out/full/ .
# 이게 없으면 빌드가 안됨 (경로 중요, web 폴더 안에 .env 파일이 있어야 함)
COPY ./apps/web/.env  ./apps/web/.env

# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM

# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

# Turborepo 전체에서 build 실행
RUN pnpm turbo run build




FROM base AS runner
WORKDIR /app

RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs \
    && rm -rf /var/lib/apt/lists/*


USER nextjs

COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

# 불필요한 캐시 제거 (의미 없음... 크기 변화 없음)
RUN rm -rf .next/cache

CMD node apps/web/server.js
